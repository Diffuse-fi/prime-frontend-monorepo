import type {
  SelectedVault,
  TxInfo,
  TxState,
  VaultFullInfo,
  VaultLimits,
} from "../types";

import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import pLimit from "p-limit";
import { useMemo, useState } from "react";
import { type Address, getAddress, type Hash } from "viem";

import { trackEvent } from "@/lib/analytics";

import { formatUnits } from "../../formatters/asset";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { isUserRejectedError } from "../utils/errors";
import { lendLogger, loggerMut } from "../utils/loggers";

export type DepositBatchResult = {
  errors: Record<Address, Error>;
  hashes: Record<Address, Hash>;
};

export type UseDepositResult = {
  allConfirmed: boolean;
  deposit: () => Promise<DepositBatchResult>;
  isPendingBatch: boolean;
  reset: () => void;
  someAwaitingSignature: boolean;
  someError: boolean;
  txState: TxState;
};

export type UseLendParams = {
  onDepositBatchAllSuccess?: (hashes: Record<Address, Hash>) => void;
  onDepositBatchComplete?: (result: DepositBatchResult) => void;
  onDepositBatchSomeError?: (errors: Record<Address, Error>) => void;
  onDepositError?: (errorMessage: string, address: Address) => void;
  onDepositSuccess?: (vaultAddress: Address, hash: Hash) => void;
  txConcurrency?: number;
};

const ROOT = "deposit" as const;
const version = QV.deposit;
const qKeys = {
  deposit: (chainId: number, addresses: null | string) =>
    qk([ROOT, version, opt(chainId), opt(addresses)]),
};

export function useDeposit(
  selected: SelectedVault[],
  allVaults: VaultFullInfo[],
  vaultsLimits: VaultLimits[],
  {
    onDepositBatchAllSuccess,
    onDepositBatchComplete,
    onDepositBatchSomeError,
    onDepositError,
    onDepositSuccess,
    txConcurrency = 6,
  }: UseLendParams = {}
): UseDepositResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { address: wallet, chainId, publicClient } = useClients();
  const vaultsConsistency = selected.every(v => v.chainId === chainId);
  const enabled = selected?.length > 0 && !!wallet && !!publicClient && vaultsConsistency;

  const vaultByAddr = useMemo(() => {
    const m = new Map<Address, VaultFullInfo>();
    for (const v of allVaults) m.set(getAddress(v.address), v);
    return m;
  }, [allVaults]);

  const vaultsKey = useMemo(
    () =>
      Object.values(selected)
        .map(v => getAddress(v.address))
        .sort()
        .join("|"),
    [selected]
  );

  const txConcurrencyInt = Math.max(1, Math.floor(txConcurrency));
  const limit = useMemo(() => pLimit(Math.max(1, txConcurrencyInt)), [txConcurrencyInt]);

  const setPhase = (addr: Address, info: Partial<TxInfo>) =>
    setTxState(
      produce(prev => {
        prev[addr] = { ...(prev[addr] as TxInfo | undefined), ...info } as TxInfo;
      })
    );

  const setKeyPending = (key: string) =>
    setPendingByKey(
      produce(prev => {
        prev[key] = true;
      })
    );
  const clearKeyPending = (key: string) =>
    setPendingByKey(
      produce(prev => {
        delete prev[key];
      })
    );
  const isKeyPending = (key: string) => Boolean(pendingByKey[key]);

  const depositMutation = useMutation({
    mutationFn: async () => {
      const result: DepositBatchResult = { errors: {}, hashes: {} };

      if (!enabled) return result;

      for (const v of selected) {
        setPhase(getAddress(v.address), { phase: "checking" });
      }

      await Promise.all(
        selected.map(v =>
          limit(async () => {
            const vault = vaultByAddr.get(getAddress(v.address));
            const maxDeposit = vaultsLimits.find(
              l => l.address === getAddress(v.address)
            )?.maxDeposit;
            const address = getAddress(v.address);
            const amount = v.amount;
            const receiver = getAddress(wallet);
            const idemKey = makeIdemKey(chainId, address, amount, receiver);

            const currentPhase = (txState[address]?.phase ?? "idle") as TxInfo["phase"];
            const isActive =
              currentPhase === "awaiting-signature" ||
              currentPhase === "pending" ||
              currentPhase === "replaced";

            if (isActive || isKeyPending(idemKey)) {
              return;
            }

            let e: Error | null = null;

            if (!vault) {
              e = new Error("Vault not found");
            }

            if (amount <= 0n) {
              e = new Error("Amount must be greater than zero");
            }

            if (maxDeposit !== undefined && amount > maxDeposit) {
              e = new Error(
                `Amount exceeds max deposit limit of ${formatUnits(maxDeposit, v.assetDecimals)} ${
                  v.assetSymbol
                }`
              );
            }

            if (e) {
              setPhase(address, { errorMessage: e.message, phase: "error" });
              result.errors[address] = e;
              lendLogger.warn("preflight error", { address, reason: e.message });
              return;
            }

            try {
              setKeyPending(idemKey);
              setPhase(address, { phase: "awaiting-signature" });
              trackEvent("lend_deposit_start", {
                amount: amount.toString(),
                asset_symbol: v.assetSymbol,
                chain_id: chainId,
                vault_address: address,
              });

              const hash = await vault!.contract.deposit([amount, receiver]);

              setPhase(address, { hash, phase: "pending" });
              result.hashes[address] = hash;

              const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                onReplaced: r => {
                  setPhase(address, {
                    hash: r.transaction.hash,
                    phase: "replaced",
                  });
                  result.hashes[address] = r.transaction.hash;
                },
              });

              if (receipt.status === "success") {
                setPhase(address, { hash: receipt.transactionHash, phase: "success" });
                trackEvent("lend_deposit_success", {
                  amount: amount.toString(),
                  asset_symbol: v.assetSymbol,
                  chain_id: chainId,
                  transaction_hash: receipt.transactionHash,
                  vault_address: address,
                });

                onDepositSuccess?.(address, receipt.transactionHash);
              } else {
                const e = new Error("Transaction reverted");
                setPhase(address, { errorMessage: e.message, phase: "error" });
                result.errors[address] = e;
                trackEvent("lend_deposit_error", {
                  amount: amount.toString(),
                  asset_symbol: v.assetSymbol,
                  chain_id: chainId,
                  error_message: e.message,
                  vault_address: address,
                });

                onDepositError?.(e.message, address);
                lendLogger.warn("deposit error", { address, reason: e.message });
              }
            } catch (error) {
              if (isUserRejectedError(error)) {
                setPhase(address, { phase: "idle" });
                trackEvent("lend_deposit_rejected", {
                  amount: amount.toString(),
                  asset_symbol: v.assetSymbol,
                  chain_id: chainId,
                  vault_address: address,
                });
                lendLogger.info("deposit() cancelled by user", { address });
                return;
              }

              const e = error instanceof Error ? error : new Error("Unknown error");

              setPhase(address, { errorMessage: e.message, phase: "error" });
              result.errors[address] = e;
              trackEvent("lend_deposit_error", {
                amount: amount.toString(),
                asset_symbol: v.assetSymbol,
                chain_id: chainId,
                error_message: e.message,
                vault_address: address,
              });

              onDepositError?.(e.message, address);
              loggerMut.error("mutation error (deposit)", {
                address,
                error: e,
                mutationKey: qKeys.deposit(chainId, vaultsKey),
              });
            } finally {
              clearKeyPending(idemKey);
            }
          })
        )
      );

      onDepositBatchComplete?.(result);

      const errorsCount = Object.keys(result.errors).length;
      const successCount = Object.keys(result.hashes).length;

      if (errorsCount > 0) {
        onDepositBatchSomeError?.(result.errors);
      }

      if (successCount === selected.length && errorsCount === 0) {
        onDepositBatchAllSuccess?.(result.hashes);
      }

      return result;
    },
    mutationKey: qKeys.deposit(chainId, vaultsKey),
  });

  const deposit = depositMutation.mutateAsync;
  const allConfirmed =
    Object.keys(txState).length > 0 &&
    Object.values(txState).every(s => s.phase === "success");
  const someError = Object.values(txState).some(s => s.phase === "error");
  const someAwaitingSignature = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

  const reset = () => {
    setTxState({});
    depositMutation.reset();
    setPendingByKey({});
  };

  return {
    allConfirmed,
    deposit,
    isPendingBatch: depositMutation.isPending,
    reset,
    someAwaitingSignature,
    someError,
    txState,
  };
}

function makeIdemKey(chainId: number, vault: Address, amount: bigint, receiver: Address) {
  return `${chainId}:${vault.toLowerCase()}:${amount.toString()}:${receiver.toLowerCase()}`;
}

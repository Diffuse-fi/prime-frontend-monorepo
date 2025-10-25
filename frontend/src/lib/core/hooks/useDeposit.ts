import { useMemo, useState } from "react";
import pLimit from "p-limit";
import { getAddress, type Address, type Hash } from "viem";
import { useClients } from "../../wagmi/useClients";
import type {
  SelectedVault,
  TxInfo,
  TxState,
  VaultFullInfo,
  VaultLimits,
} from "../types";
import { useMutation } from "@tanstack/react-query";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { produce } from "immer";
import { formatUnits } from "../../formatters/asset";
import { isUserRejectedError } from "../utils/errors";

export type UseLendParams = {
  txConcurrency?: number;
  onDepositBatchComplete?: (result: DepositBatchResult) => void;
  onDepositBatchSomeError?: (errors: Record<Address, Error>) => void;
  onDepositBatchAllSuccess?: (hashes: Record<Address, Hash>) => void;
  onDepositError?: (errorMessage: string, address: Address) => void;
  onDepositSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type DepositBatchResult = {
  hashes: Record<Address, Hash>;
  errors: Record<Address, Error>;
};

export type UseDepositResult = {
  deposit: () => Promise<DepositBatchResult>;
  reset: () => void;
  txState: TxState;
  allConfirmed: boolean;
  someError: boolean;
  someAwaitingSignature: boolean;
  isPendingBatch: boolean;
};

const ROOT = "deposit" as const;
const version = QV.deposit;
const qKeys = {
  deposit: (chainId: number, addresses: string | null) =>
    qk([ROOT, version, opt(chainId), opt(addresses)]),
};

function makeIdemKey(chainId: number, vault: Address, amount: bigint, receiver: Address) {
  return `${chainId}:${vault.toLowerCase()}:${amount.toString()}:${receiver.toLowerCase()}`;
}

export function useDeposit(
  selected: SelectedVault[],
  allVaults: VaultFullInfo[],
  vaultsLimits: VaultLimits[],
  {
    txConcurrency = 6,
    onDepositBatchComplete,
    onDepositError,
    onDepositSuccess,
    onDepositBatchSomeError,
    onDepositBatchAllSuccess,
  }: UseLendParams = {}
): UseDepositResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { chainId, address: wallet, publicClient } = useClients();
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
    mutationKey: qKeys.deposit(chainId, vaultsKey),
    mutationFn: async () => {
      const result: DepositBatchResult = { hashes: {}, errors: {} };

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
              setPhase(address, { phase: "error", errorMessage: e.message });
              result.errors[address] = e;
              return;
            }

            try {
              setKeyPending(idemKey);
              setPhase(address, { phase: "awaiting-signature" });

              const hash = await vault!.contract.deposit([amount, receiver]);

              setPhase(address, { phase: "pending", hash });
              result.hashes[address] = hash;

              const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                onReplaced: r => {
                  setPhase(address, {
                    phase: "replaced",
                    hash: r.transaction.hash,
                  });
                  result.hashes[address] = r.transaction.hash;
                },
              });

              if (receipt.status === "success") {
                setPhase(address, { phase: "success", hash: receipt.transactionHash });

                onDepositSuccess?.(address, receipt.transactionHash);
              } else {
                const e = new Error("Transaction reverted");
                setPhase(address, { phase: "error", errorMessage: e.message });
                result.errors[address] = e;

                onDepositError?.(e.message, address);
              }
            } catch (error) {
              if (isUserRejectedError(error)) {
                setPhase(address, { phase: "idle" });
                return;
              }

              const e = error instanceof Error ? error : new Error("Unknown error");

              setPhase(address, { phase: "error", errorMessage: e.message });
              result.errors[address] = e;

              onDepositError?.(e.message, address);
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
    deposit,
    reset,
    txState,
    allConfirmed,
    someError,
    someAwaitingSignature,
    isPendingBatch: depositMutation.isPending,
  };
}

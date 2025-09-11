import { useMemo, useState } from "react";
import pLimit from "p-limit";
import { getAddress, type Address, type Hash } from "viem";
import { useClients } from "../../wagmi/useClients";
import type {
  BatchResult,
  SelectedVault,
  TxInfo,
  TxState,
  VaultFullInfo,
} from "../types";
import { useMutation } from "@tanstack/react-query";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { produce } from "immer";
import { formatUnits } from "../../formatters/asset";

export type UseWithdrawParams = {
  txConcurrency?: number;

  onWithdrawSuccess?: (vaultAddress: Address, hash: Hash) => void;
  onWithdrawError?: (errorMessage: string, address: Address) => void;

  onWithdrawBatchComplete?: (result: BatchResult) => void;
  onWithdrawBatchSomeError?: (errors: Record<Address, Error>) => void;
  onWithdrawBatchAllSuccess?: (hashes: Record<Address, Hash>) => void;
};

export type UseWithdrawResult = {
  withdraw: (params: {
    vaultAddress: Address;
    amount: bigint; // assets
    receiverOverride?: Address;
    ownerOverride?: Address;
  }) => Promise<Hash | null>;

  withdrawAll: (selected: SelectedVault[]) => Promise<BatchResult>;

  reset: () => void;
  txState: TxState;
  allConfirmed: boolean;
  someError: boolean;
  someAwaitingSignature: boolean;
  isPendingSingle: boolean;
  isPendingBatch: boolean;
};

const ROOT = "withdraw" as const;
const version = QV.withdraw;
const qKeys = {
  single: (chainId: number, vault: Address | null, wallet?: Address | null) =>
    qk([
      ROOT,
      "single",
      version,
      opt(chainId),
      opt(vault),
      opt(wallet),
    ]),
  batch: (chainId: number, addresses: string | null) =>
    qk([ROOT, "batch", version, opt(chainId), opt(addresses)]),
};

function makeIdemKey(
  chainId: number,
  vault: Address,
  amount: bigint,
  owner: Address,
  receiver: Address
) {
  return `${chainId}:${vault.toLowerCase()}:${amount.toString()}:${owner.toLowerCase()}:${receiver.toLowerCase()}`;
}

export function useWithdraw(
  allVaults: VaultFullInfo[],
  {
    txConcurrency = 6,
    onWithdrawSuccess,
    onWithdrawError,
    onWithdrawBatchComplete,
    onWithdrawBatchSomeError,
    onWithdrawBatchAllSuccess,
  }: UseWithdrawParams = {}
): UseWithdrawResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { chainId, address: wallet, publicClient } = useClients();

  const vaultByAddr = useMemo(() => {
    const m = new Map<Address, VaultFullInfo>();
    for (const v of allVaults) m.set(getAddress(v.address), v);
    return m;
  }, [allVaults]);

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

  const singleMutation = useMutation({
    mutationKey: qKeys.single(chainId, null, wallet ?? null),
    mutationFn: async (params: {
      vaultAddress: Address;
      amount: bigint;
      receiverOverride?: Address;
      ownerOverride?: Address;
    }) => {
      if (!wallet || !publicClient || !chainId) return null;

      const address = getAddress(params.vaultAddress);
      const vault = vaultByAddr.get(address);
      const owner = getAddress(params.ownerOverride ?? wallet);
      const receiver = getAddress(params.receiverOverride ?? wallet);
      const assets = params.amount;

      const idemKey = makeIdemKey(chainId, address, assets, owner, receiver);
      const currentPhase = (txState[address]?.phase ?? "idle") as TxInfo["phase"];
      const isActive =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";

      if (isActive || isKeyPending(idemKey)) return null;

      let e: Error | null = null;
      if (!vault) e = new Error("Vault not found");
      if (assets <= 0n) e = new Error("Amount must be greater than zero");
      const maxWithdraw = vault?.limits?.maxWithdraw;
      if (maxWithdraw !== undefined && assets > maxWithdraw) {
        e = new Error(
          `Amount exceeds max withdraw limit of ${formatUnits(maxWithdraw, vault!.assets[0].decimals)} ${
            vault!.assets[0].symbol
          }`
        );
      }
      if (e) {
        setPhase(address, { phase: "error", errorMessage: e.message });
        onWithdrawError?.(e.message, address);
        return null;
      }

      try {
        setKeyPending(idemKey);
        setPhase(address, { phase: "awaiting-signature" });

        const hash = await vault!.contract.withdraw([assets, receiver, owner]);

        setPhase(address, { phase: "pending", hash });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(address, { phase: "replaced", hash: r.transaction.hash });
          },
        });

        if (receipt.status === "success") {
          setPhase(address, { phase: "success", hash: receipt.transactionHash });
          onWithdrawSuccess?.(address, receipt.transactionHash);
          return receipt.transactionHash;
        } else {
          const err = new Error("Transaction reverted");
          setPhase(address, { phase: "error", errorMessage: err.message });
          onWithdrawError?.(err.message, address);
          return null;
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        setPhase(address, { phase: "error", errorMessage: err.message });
        onWithdrawError?.(err.message, address);
        return null;
      } finally {
        clearKeyPending(idemKey);
      }
    },
  });

  const batchMutation = useMutation({
    mutationKey: qKeys.batch(
      chainId ?? 0,
      useMemo(() => null, [])
    ),
    mutationFn: async (selected: SelectedVault[]) => {
      const result: BatchResult = { hashes: {}, errors: {} };

      if (!wallet || !publicClient || !chainId || selected.length === 0) return result;
      const vaultsConsistency = selected.every(v => v.chainId === chainId);
      if (!vaultsConsistency) return result;

      for (const v of selected) setPhase(getAddress(v.address), { phase: "checking" });

      await Promise.all(
        selected.map(v =>
          limit(async () => {
            const address = getAddress(v.address);
            const vault = vaultByAddr.get(address);
            const owner = getAddress(wallet);
            const receiver = getAddress(wallet);
            const assets = v.amount;

            const idemKey = makeIdemKey(chainId, address, assets, owner, receiver);
            const currentPhase = (txState[address]?.phase ?? "idle") as TxInfo["phase"];
            const isActive =
              currentPhase === "awaiting-signature" ||
              currentPhase === "pending" ||
              currentPhase === "replaced";

            if (isActive || isKeyPending(idemKey)) return;

            let e: Error | null = null;
            if (!vault) e = new Error("Vault not found");
            if (assets <= 0n) e = new Error("Amount must be greater than zero");
            const maxWithdraw = vault?.limits?.maxWithdraw;
            if (maxWithdraw !== undefined && assets > maxWithdraw) {
              e = new Error(
                `Amount exceeds max withdraw limit of ${formatUnits(
                  maxWithdraw,
                  v.assetDecimals
                )} ${v.assetSymbol}`
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

              const hash = await vault!.contract.withdraw([assets, receiver, owner]);

              setPhase(address, { phase: "pending", hash });
              result.hashes[address] = hash;

              const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                onReplaced: r => {
                  setPhase(address, { phase: "replaced", hash: r.transaction.hash });
                  result.hashes[address] = r.transaction.hash;
                },
              });

              if (receipt.status === "success") {
                setPhase(address, { phase: "success", hash: receipt.transactionHash });
              } else {
                const err = new Error("Transaction reverted");
                setPhase(address, { phase: "error", errorMessage: err.message });
                result.errors[address] = err;
              }
            } catch (error) {
              const err = error instanceof Error ? error : new Error("Unknown error");
              setPhase(address, { phase: "error", errorMessage: err.message });
              result.errors[address] = err;
            } finally {
              clearKeyPending(idemKey);
            }
          })
        )
      );

      onWithdrawBatchComplete?.(result);

      const errorsCount = Object.keys(result.errors).length;
      const successCount = Object.keys(result.hashes).length;
      if (errorsCount > 0) onWithdrawBatchSomeError?.(result.errors);
      if (successCount === selected.length && errorsCount === 0)
        onWithdrawBatchAllSuccess?.(result.hashes);

      return result;
    },
  });

  const withdraw = singleMutation.mutateAsync;
  const withdrawAll = batchMutation.mutateAsync;

  const allConfirmed =
    Object.keys(txState).length > 0 &&
    Object.values(txState).every(s => s.phase === "success");
  const someError = Object.values(txState).some(s => s.phase === "error");
  const someAwaitingSignature = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

  const reset = () => {
    setTxState({});
    setPendingByKey({});
    singleMutation.reset();
    batchMutation.reset();
  };

  return {
    withdraw,
    withdrawAll,
    reset,
    txState,
    allConfirmed,
    someError,
    someAwaitingSignature,
    isPendingSingle: singleMutation.isPending,
    isPendingBatch: batchMutation.isPending,
  };
}

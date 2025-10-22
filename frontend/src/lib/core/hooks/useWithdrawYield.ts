import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getAddress, type Address, type Hash } from "viem";
import { produce } from "immer";
import { useClients } from "../../wagmi/useClients";
import type { TxInfo, TxState, VaultFullInfo } from "../types";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";

export type UseWithdrawYieldParams = {
  onWithdrawYieldSuccess?: (vaultAddress: Address, hash: Hash) => void;
  onWithdrawYieldError?: (errorMessage: string, address: Address) => void;
};

export type UseWithdrawYieldResult = {
  withdrawYield: (params: {
    vaultAddress: Address;
    strategyIds: bigint[];
  }) => Promise<Hash | null>;
  reset: () => void;
  txState: TxState;
  allConfirmed: boolean;
  someError: boolean;
  someAwaitingSignature: boolean;
  isPending: boolean;
};

const ROOT = "withdrawYield" as const;
const version = QV.withdrawYield;

const qKeys = {
  single: (chainId: number, wallet?: Address | null) =>
    qk([ROOT, "single", version, opt(chainId), opt(wallet ?? null)]),
};

function makeIdemKey(
  chainId: number,
  vault: Address,
  owner: Address,
  receiver: Address,
  strategyIds: readonly bigint[]
) {
  return `${chainId}:${vault.toLowerCase()}:${owner.toLowerCase()}:${receiver.toLowerCase()}:${strategyIds
    .map(String)
    .join(",")}`;
}

export function useWithdrawYield(
  allVaults: VaultFullInfo[],
  { onWithdrawYieldSuccess, onWithdrawYieldError }: UseWithdrawYieldParams = {}
): UseWithdrawYieldResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { chainId, address: wallet, publicClient } = useClients();

  const vaultByAddr = useMemo(() => {
    const m = new Map<Address, VaultFullInfo>();
    for (const v of allVaults) m.set(getAddress(v.address), v);
    return m;
  }, [allVaults]);

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
    mutationKey: qKeys.single(chainId ?? 0, wallet ?? null),
    mutationFn: async (params: {
      vaultAddress: Address;
      strategyIds: bigint[];
      receiverOverride?: Address;
      ownerOverride?: Address;
    }) => {
      if (!wallet || !publicClient || !chainId) return null;

      const address = getAddress(params.vaultAddress);
      const vault = vaultByAddr.get(address);
      const owner = getAddress(params.ownerOverride ?? wallet);
      const receiver = getAddress(params.receiverOverride ?? wallet);
      const strategyIds = params.strategyIds ?? [];

      const idemKey = makeIdemKey(chainId, address, owner, receiver, strategyIds);
      const currentPhase = (txState[address]?.phase ?? "idle") as TxInfo["phase"];
      const isActive =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";

      if (isActive || isKeyPending(idemKey)) return null;

      let e: Error | null = null;
      if (!vault) e = new Error("Vault not found");
      if (!Array.isArray(strategyIds) || strategyIds.length === 0)
        e = new Error("strategyIds must be a non-empty array");
      if (e) {
        setPhase(address, { phase: "error", errorMessage: e.message });
        onWithdrawYieldError?.(e.message, address);
        return null;
      }

      try {
        setKeyPending(idemKey);
        setPhase(address, { phase: "awaiting-signature" });
        const sortedStrategyIds = [...strategyIds].sort((a, b) =>
          a < b ? -1 : a > b ? 1 : 0
        );

        const hash = await vault!.contract.withdrawYield([sortedStrategyIds]);

        setPhase(address, { phase: "pending", hash });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(address, { phase: "replaced", hash: r.transaction.hash });
          },
        });

        if (receipt.status === "success") {
          setPhase(address, { phase: "success", hash: receipt.transactionHash });
          onWithdrawYieldSuccess?.(address, receipt.transactionHash);
          return receipt.transactionHash;
        } else {
          const err = new Error("Transaction reverted");
          setPhase(address, { phase: "error", errorMessage: err.message });
          onWithdrawYieldError?.(err.message, address);
          return null;
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        setPhase(address, { phase: "error", errorMessage: err.message });
        onWithdrawYieldError?.(err.message, address);
        return null;
      } finally {
        clearKeyPending(idemKey);
      }
    },
  });

  const withdrawYield = singleMutation.mutateAsync;

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
  };

  return {
    withdrawYield,
    reset,
    txState,
    allConfirmed,
    someError,
    someAwaitingSignature,
    isPending: singleMutation.isPending,
  };
}

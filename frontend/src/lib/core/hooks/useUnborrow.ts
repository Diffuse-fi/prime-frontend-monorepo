import { useState, useMemo } from "react";
import { getAddress, type Address, type Hash } from "viem";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useClients } from "../../wagmi/useClients";
import { qk, opt } from "../../query/helpers";
import { QV } from "../../query/versions";
import type { VaultFullInfo, TxInfo, TxState } from "../types";

export type UseUnborrowParams = {
  onSuccess?: (args: { vault: Address; positionId: bigint; hash: Hash }) => void;
  onError?: (args: { vault: Address; positionId: bigint; message: string }) => void;
};

export type UseUnborrowResult = {
  unborrow: (params: {
    vaultAddress: Address;
    positionId: bigint;
    minAssetsOut?: bigint;
    slippageBps?: number;
    deadline: bigint;
  }) => Promise<Hash | null>;

  reset: () => void;
  txState: TxState;
  isPending: boolean;
  someAwaitingSignature: boolean;
  someError: boolean;
};

const ROOT = "unborrow" as const;
const version = QV.borrow;

const qKeySingle = (chainId: number, wallet?: Address | null) =>
  qk([ROOT, "single", version, opt(chainId), opt(wallet)]);

function idemKey(
  chainId: number,
  vault: Address,
  positionId: bigint,
  minAssetsOut: bigint,
  deadline: bigint
) {
  return `${chainId}:${vault.toLowerCase()}:${positionId.toString()}:${minAssetsOut.toString()}:${deadline.toString()}`;
}

export function useUnborrow(
  allVaults: VaultFullInfo[],
  { onSuccess, onError }: UseUnborrowParams = {}
): UseUnborrowResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { chainId, address: wallet, publicClient, walletClient } = useClients();

  const vaultByAddr = useMemo(() => {
    const m = new Map<Address, VaultFullInfo>();
    for (const v of allVaults) m.set(getAddress(v.address), v);
    return m;
  }, [allVaults]);

  const setPhase = (key: string, info: Partial<TxInfo>) =>
    setTxState(
      produce(prev => {
        prev[key as keyof TxState] = {
          ...(prev[key] as TxInfo | undefined),
          ...info,
        } as TxInfo;
      })
    );

  const setKeyPending = (key: string) =>
    setPendingByKey(produce(prev => void (prev[key] = true)));
  const clearKeyPending = (key: string) =>
    setPendingByKey(produce(prev => void delete prev[key]));

  const singleMutation = useMutation({
    mutationKey: qKeySingle(chainId ?? 0, wallet ?? null),
    mutationFn: async (params: {
      vaultAddress: Address;
      positionId: bigint;
      minAssetsOut?: bigint;
      slippageBps?: number;
      deadline: bigint;
    }) => {
      if (!wallet || !publicClient || !walletClient || !chainId) return null;

      const address = getAddress(params.vaultAddress);
      const vault = vaultByAddr.get(address);
      const positionId = params.positionId;
      const deadline = params.deadline;

      const stateKey = `${address}:${positionId}`;
      const currentPhase = (txState[stateKey]?.phase ?? "idle") as TxInfo["phase"];
      const active =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";
      if (active) return null;

      // Pre-Checks
      let e: Error | null = null;
      if (!vault) e = new Error("Vault not found");
      if (positionId <= 0n) e = new Error("Invalid positionId");
      if (deadline <= 0n) e = new Error("Invalid deadline");
      if (e) {
        setPhase(stateKey, { phase: "error", errorMessage: e.message });
        onError?.({ vault: address, positionId, message: e.message });
        return null;
      }

      try {
        setPhase(stateKey, { phase: "awaiting-signature" });
        const { result: simOut, request } = await publicClient.simulateContract({
          address,
          abi: vaultAbi,
          functionName: "unborrow",
          args: [positionId, 0n, deadline],
          account: walletClient.account!,
        });
        const expectedOut = simOut as bigint;

        const bps = Math.max(0, Math.min(10_000, Math.floor(params.slippageBps ?? 0)));
        const minOut =
          params.minAssetsOut ?? (expectedOut * BigInt(10_000 - bps)) / 10_000n;

        const key = idemKey(chainId, address, positionId, minOut, deadline);
        if (pendingByKey[key]) return null;
        setKeyPending(key);

        // 3) Send TX (reusing simulated request but override args)
        setPhase(stateKey, { phase: "pending" });
        const hash = await walletClient.writeContract({
          ...request,
          args: [positionId, minOut, deadline],
        });

        // 4) Wait receipt & handle replacement
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(stateKey, { phase: "replaced", hash: r.transaction.hash });
          },
        });

        if (receipt.status === "success") {
          setPhase(stateKey, { phase: "success", hash: receipt.transactionHash });
          onSuccess?.({ vault: address, positionId, hash: receipt.transactionHash });
          return receipt.transactionHash;
        } else {
          const err = new Error("Transaction reverted");
          setPhase(stateKey, { phase: "error", errorMessage: err.message });
          onError?.({ vault: address, positionId, message: err.message });
          return null;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setPhase(stateKey, { phase: "error", errorMessage: msg });
        onError?.({ vault: address, positionId, message: msg });
        return null;
      } finally {
        clearKeyPending(
          idemKey(
            chainId,
            getAddress(params.vaultAddress),
            params.positionId,
            params.minAssetsOut ?? 0n,
            params.deadline
          )
        );
      }
    },
  });

  const reset = () => {
    setTxState({});
    setPendingByKey({});
    singleMutation.reset();
  };

  return {
    unborrow: singleMutation.mutateAsync,
    reset,
    txState,
    isPending: singleMutation.isPending,
    someAwaitingSignature: Object.values(txState).some(
      s => s.phase === "awaiting-signature"
    ),
    someError: Object.values(txState).some(s => s.phase === "error"),
  };
}

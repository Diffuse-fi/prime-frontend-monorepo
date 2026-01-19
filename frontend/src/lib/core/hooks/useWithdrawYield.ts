import type { TxInfo, TxState, VaultFullInfo } from "../types";

import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useMemo, useState } from "react";
import { type Address, getAddress, type Hash } from "viem";

import { makeIdempotencyKey } from "@/lib/misc/idempotency";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { isUserRejectedError } from "../utils/errors";
import { lendLogger, loggerMut } from "../utils/loggers";

export type UseWithdrawYieldParams = {
  onWithdrawYieldError?: (errorMessage: string, address: Address) => void;
  onWithdrawYieldSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type UseWithdrawYieldResult = {
  allConfirmed: boolean;
  isPending: boolean;
  reset: () => void;
  someAwaitingSignature: boolean;
  someError: boolean;
  txState: TxState;
  withdrawYield: (params: {
    strategyIds: bigint[];
    vaultAddress: Address;
  }) => Promise<Hash | null>;
};

const ROOT = "withdrawYield" as const;
const version = QV.withdrawYield;

const qKeys = {
  single: (chainId: number, wallet?: Address | null) =>
    qk([ROOT, "single", version, opt(chainId), opt(wallet ?? null)]),
};

export function useWithdrawYield(
  allVaults: VaultFullInfo[],
  { onWithdrawYieldError, onWithdrawYieldSuccess }: UseWithdrawYieldParams = {}
): UseWithdrawYieldResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { address: wallet, chainId, publicClient } = useClients();

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
    mutationFn: async (params: {
      ownerOverride?: Address;
      receiverOverride?: Address;
      strategyIds: bigint[];
      vaultAddress: Address;
    }) => {
      if (!wallet || !publicClient || !chainId) return null;

      const address = getAddress(params.vaultAddress);
      const vault = vaultByAddr.get(address);
      const owner = getAddress(params.ownerOverride ?? wallet);
      const receiver = getAddress(params.receiverOverride ?? wallet);
      const strategyIds = params.strategyIds ?? [];

      const idemKey = makeIdempotencyKey(
        chainId,
        address,
        strategyIds.join(","),
        receiver
      );
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
        setPhase(address, { errorMessage: e.message, phase: "error" });
        onWithdrawYieldError?.(e.message, address);
        lendLogger.error("withdraw yield failed: validation error", {
          error: e.message,
          owner,
          receiver,
          strategyIds: strategyIds.map(String).join(","),
          vault: address,
        });
        return null;
      }

      try {
        setKeyPending(idemKey);
        setPhase(address, { phase: "awaiting-signature" });
        const sortedStrategyIds = [...strategyIds].sort((a, b) =>
          a < b ? -1 : a > b ? 1 : 0
        );

        const hash = await vault!.contract.withdrawYield([sortedStrategyIds, receiver]);

        setPhase(address, { hash, phase: "pending" });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(address, { hash: r.transaction.hash, phase: "replaced" });
          },
        });

        if (receipt.status === "success") {
          setPhase(address, { hash: receipt.transactionHash, phase: "success" });
          onWithdrawYieldSuccess?.(address, receipt.transactionHash);
          return receipt.transactionHash;
        } else {
          const err = new Error("Transaction reverted");
          setPhase(address, { errorMessage: err.message, phase: "error" });
          onWithdrawYieldError?.(err.message, address);
          lendLogger.error("withdraw yield failed: transaction reverted", {
            hash,
            vault: address,
          });

          return null;
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase(address, { phase: "idle" });
          lendLogger.info("withdraw yield cancelled by user", { address });
          return null;
        }

        const err = error instanceof Error ? error : new Error("Unknown error");
        setPhase(address, { errorMessage: err.message, phase: "error" });
        onWithdrawYieldError?.(err.message, address);
        loggerMut.error("mutation error (withdraw yield)", {
          address,
          error: err,
          mutationKey: qKeys.single(chainId, wallet),
        });

        return null;
      } finally {
        clearKeyPending(idemKey);
      }
    },
    mutationKey: qKeys.single(chainId ?? 0, wallet ?? null),
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
    allConfirmed,
    isPending: singleMutation.isPending,
    reset,
    someAwaitingSignature,
    someError,
    txState,
    withdrawYield,
  };
}

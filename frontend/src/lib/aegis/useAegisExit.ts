import type {
  AegisExitResult,
  AegisExitSelected,
  AegisExitStageInfo,
  AegisExitTxInfo,
  AegisExitTxKey,
  AegisExitTxState,
} from "./types";
import type { Address, Hash } from "viem";

import { useMutation, useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { useMemo, useState } from "react";
import { getAddress } from "viem";

import { env } from "@/env";
import { trackEvent } from "@/lib/analytics";
import { getSlippageBpsFromKey } from "@/lib/formulas/slippage";

import { VaultFullInfo } from "../core/types";
import { isUserRejectedError } from "../core/utils/errors";
import { borrowLogger, loggerMut } from "../core/utils/loggers";
import { makeIdempotencyKey } from "../misc/idempotency";
import { opt, qk } from "../query/helpers";
import { QV } from "../query/versions";
import { useClients } from "../wagmi/useClients";
import { requestAegisRedeemEncodedData } from "./api";
import { isDataEmptyError, toErr } from "./errors";

export type UseAegisExitParams = {
  onComplete?: (result: AegisExitResult) => void;
  onError?: (errorMessage: string, address: Address) => void;
  onSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

const ROOT = "aegisExit";
const version = QV.borrow;
const qKeys = {
  redeem: (
    chainId: number | undefined,
    address: Address | undefined,
    positionId: bigint | undefined
  ) =>
    qk([
      ROOT,
      version,
      "redeem",
      opt(chainId),
      opt(address),
      opt(positionId?.toString()),
    ]),
  routeInfo: (
    chainId: number | undefined,
    address: Address | undefined,
    positionId: bigint | undefined
  ) =>
    qk([
      ROOT,
      version,
      "routeInfo",
      opt(chainId),
      opt(address),
      opt(positionId?.toString()),
    ]),
  stage: (
    chainId: number | undefined,
    address: Address | undefined,
    positionId: bigint | undefined
  ) =>
    qk([
      ROOT,
      version,
      "stage",
      opt(chainId),
      opt(address),
      opt(positionId?.toString()),
    ]),
  tx: (
    chainId: number | undefined,
    address: Address | undefined,
    positionId: bigint | undefined
  ) =>
    qk([
      ROOT,
      version,
      "tx",
      opt(chainId),
      opt(address),
      opt(positionId?.toString()),
    ]),
};

export function useAegisExit(
  selected: AegisExitSelected | null,
  vault: VaultFullInfo,
  { onComplete, onError, onSuccess }: UseAegisExitParams
) {
  const { address: wallet, chainId, publicClient, walletClient } = useClients();
  const [txState, setTxState] = useState<AegisExitTxState>({});
  const [pendingKey, setPendingKey] = useState<null | string>(null);

  const enabled =
    !!selected &&
    !!vault &&
    selected.isAegisStrategy &&
    !!wallet &&
    !!walletClient &&
    !!publicClient &&
    selected.chainId === chainId;

  const addr = useMemo(
    () => (selected ? getAddress(selected.address) : undefined),
    [selected]
  );

  const setPhase = (key: AegisExitTxKey, info: Partial<AegisExitTxInfo>) =>
    setTxState(
      produce(prev => {
        prev[key] = {
          ...(prev[key] as AegisExitTxInfo | undefined),
          ...info,
        } as AegisExitTxInfo;
      })
    );

  const stageQuery = useQuery({
    enabled: !!enabled && !!selected && !!addr && !!vault,
    queryFn: async ({ signal }): Promise<AegisExitStageInfo> => {
      if (!selected || !vault) return { message: "Not ready", stage: -1 };

      const hasSwap = await vault.contract.hasUnfinishedSwap(selected.positionId, {
        signal,
      });
      if (!hasSwap) return { message: "Exit not started", stage: 0 };

      try {
        const sim = await vault.contract.unborrow([
          selected.positionId,
          selected.strategyId,
          selected.deadline,
          getSlippageBpsFromKey(selected.slippage),
        ]);

        if (sim) return { message: "Exit completed", stage: 3 };
        return { message: "Waiting for approval", stage: 2 };
      } catch (error) {
        if (isDataEmptyError(error)) return { message: "Need encodedData", stage: 1 };
        return { message: toErr(error).message, stage: -1 };
      }
    },
    queryKey: qKeys.stage(chainId, addr, selected?.positionId),
    refetchInterval: q => {
      const stage = q.state.data?.stage ?? 0;
      return stage === 2 ? 60_000 : false;
    },
  });

  const lockMutation = useMutation({
    mutationFn: async (): Promise<AegisExitResult> => {
      const result: AegisExitResult = {};
      if (!enabled || !selected || !addr || !wallet) return result;

      const idemKey = makeIdempotencyKey(
        chainId!,
        addr,
        selected.positionId,
        selected.slippage,
        selected.deadline,
        wallet,
        "lock"
      );

      const active = isActive(txState.lock?.phase) || pendingKey === idemKey;
      if (active) return result;

      try {
        setPendingKey(idemKey);
        setPhase("lock", { phase: "awaiting-signature" });

        trackEvent("borrow_aegis_exit_lock_start", {
          chain_id: chainId!,
          position_id: selected.positionId.toString(),
          vault_address: addr,
        });

        const hash = await vault.contract.unborrow([
          selected.positionId,
          selected.strategyId,
          selected.deadline,
          getSlippageBpsFromKey(selected.slippage),
        ]);

        setPhase("lock", { hash, phase: "pending" });
        result.hash = hash;

        const receipt = await publicClient!.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase("lock", { hash: r.transaction.hash, phase: "replaced" });
            result.hash = r.transaction.hash;
          },
        });

        if (receipt.status === "success") {
          setPhase("lock", { hash: receipt.transactionHash, phase: "success" });
          result.hash = receipt.transactionHash;
          stageQuery.refetch();
        } else {
          throw new Error("Transaction reverted");
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase("lock", { phase: "idle" });
          return result;
        }

        const e = toErr(error);
        setPhase("lock", { errorMessage: e.message, phase: "error" });
        result.error = e;
        onError?.(e.message, addr);
        loggerMut.error("mutation error (aegis lock)", {
          address: addr,
          error: e,
          mutationKey: qKeys.tx(chainId, addr, selected?.positionId),
        });
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onComplete?.(result);
      }

      return result;
    },
    mutationKey: qKeys.tx(chainId, addr, selected?.positionId),
  });

  const redeemMutation = useMutation({
    mutationFn: async (): Promise<AegisExitResult> => {
      const result: AegisExitResult = {};
      if (!enabled || !selected || !addr || !wallet || !vault) return result;

      const route = await vault.contract.reverseRoute(selected.strategyId);

      if (!route) throw new Error("Route info missing");

      const idemKey = makeIdempotencyKey(
        chainId!,
        addr,
        selected.positionId,
        selected.slippage,
        selected.deadline,
        wallet,
        "redeem"
      );

      const active = isActive(txState.redeem?.phase) || pendingKey === idemKey;
      if (active) return result;

      try {
        setPendingKey(idemKey);
        setPhase("redeem", { phase: "checking" });

        const {} = await requestAegisRedeemEncodedData({
          baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
          req: {
            collateralAsset: selected.collateralAsset,
            slippageBps: getSlippageBpsFromKey(selected.slippage),
            yusdAmount: 10_000n,
          },
        });

        setPhase("redeem", { phase: "awaiting-signature" });

        trackEvent("borrow_aegis_exit_redeem_start", {
          chain_id: chainId!,
          position_id: selected.positionId.toString(),
          vault_address: addr,
        });

        const hash = "0x";

        setPhase("redeem", { hash, phase: "pending" });
        result.hash = hash;

        const receipt = await publicClient!.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase("redeem", { hash: r.transaction.hash, phase: "replaced" });
            result.hash = r.transaction.hash;
          },
        });

        if (receipt.status === "success") {
          setPhase("redeem", { hash: receipt.transactionHash, phase: "success" });
          result.hash = receipt.transactionHash;
          stageQuery.refetch();
        } else {
          throw new Error("Transaction reverted");
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase("redeem", { phase: "idle" });
          return result;
        }
        const e = toErr(error);
        setPhase("redeem", { errorMessage: e.message, phase: "error" });
        result.error = e;
        onError?.(e.message, addr);
        loggerMut.error("mutation error (aegis redeem)", {
          address: addr,
          error: e,
          mutationKey: qKeys.redeem(chainId, addr, selected?.positionId),
        });
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onComplete?.(result);
      }

      return result;
    },
    mutationKey: qKeys.redeem(chainId, addr, selected?.positionId),
  });

  const finalizeMutation = useMutation({
    mutationFn: async (): Promise<AegisExitResult> => {
      const result: AegisExitResult = {};
      if (!enabled || !selected || !addr || !wallet) return result;

      const idemKey = makeIdempotencyKey(
        chainId!,
        addr,
        selected.positionId,
        selected.slippage,
        selected.deadline,
        wallet,
        "finalize"
      );

      const active = isActive(txState.finalize?.phase) || pendingKey === idemKey;
      if (active) return result;

      try {
        setPendingKey(idemKey);
        setPhase("finalize", { phase: "awaiting-signature" });

        trackEvent("borrow_aegis_exit_finalize_start", {
          chain_id: chainId!,
          position_id: selected.positionId.toString(),
          vault_address: addr,
        });

        const hash = "0x";

        setPhase("finalize", { hash, phase: "pending" });
        result.hash = hash;

        const receipt = await publicClient!.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase("finalize", { hash: r.transaction.hash, phase: "replaced" });
            result.hash = r.transaction.hash;
          },
        });

        if (receipt.status === "success") {
          setPhase("finalize", { hash: receipt.transactionHash, phase: "success" });
          result.hash = receipt.transactionHash;
          onSuccess?.(addr, receipt.transactionHash);
          stageQuery.refetch();
        } else {
          throw new Error("Transaction reverted");
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase("finalize", { phase: "idle" });
          return result;
        }
        const e = toErr(error);
        setPhase("finalize", { errorMessage: e.message, phase: "error" });
        result.error = e;
        onError?.(e.message, addr);
        borrowLogger.error("aegis finalize error", { address: addr, error: e });
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onComplete?.(result);
      }

      return result;
    },
    mutationKey: qKeys.tx(chainId, addr, selected?.positionId),
  });

  const reset = () => {
    setTxState({});
    setPendingKey(null);
    lockMutation.reset();
    redeemMutation.reset();
    finalizeMutation.reset();
  };

  const someAwaitingSignature = Object.values(txState).some(
    v => v?.phase === "awaiting-signature"
  );
  const someError = Object.values(txState).some(v => v?.phase === "error");
  const isPending =
    lockMutation.isPending || redeemMutation.isPending || finalizeMutation.isPending;

  const allConfirmed =
    Object.keys(txState).length > 0 &&
    Object.values(txState).every(v => v?.phase === "success");

  return {
    allConfirmed,
    finalize: finalizeMutation.mutateAsync,
    isPending,
    lock: lockMutation.mutateAsync,
    redeem: redeemMutation.mutateAsync,
    refetchStage: stageQuery.refetch,
    reset,
    someAwaitingSignature,
    someError,
    stage: stageQuery.data,
    txState,
  };
}

function isActive(phase: AegisExitTxInfo["phase"] | undefined) {
  return phase === "awaiting-signature" || phase === "pending" || phase === "replaced";
}

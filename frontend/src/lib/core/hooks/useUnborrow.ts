import { useMemo, useState } from "react";
import { getAddress, type Address, type Hash } from "viem";
import { useClients } from "../../wagmi/useClients";
import type { TxInfo, TxState, VaultFullInfo } from "../types";
import { useMutation } from "@tanstack/react-query";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { produce } from "immer";
import { getSlippageBps } from "@/lib/formulas/slippage";
import { isUserRejectedError } from "../utils/errors";
import { borrowLogger, loggerMut } from "../utils/loggers";

export type SelectedUnborrow = {
  chainId: number;
  address: Address;
  positionId: bigint;
  slippage: string;
  deadline: bigint;
};

export type UseUnborrowParams = {
  onUnborrowComplete?: (result: UnborrowResult) => void;
  onUnborrowError?: (errorMessage: string, address: Address) => void;
  onUnborrowSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type UnborrowResult = {
  hash?: Hash;
  error?: Error;
};

export type UseUnborrowResult = {
  unborrow: () => Promise<UnborrowResult>;
  reset: () => void;
  txState: TxState;
  allConfirmed: boolean;
  someError: boolean;
  someAwaitingSignature: boolean;
  isPending: boolean;
};

const ROOT = "unborrow" as const;
const version = QV.borrow;
const qKeys = {
  unborrow: (chainId: number | undefined, address: Address | undefined) =>
    qk([ROOT, version, opt(chainId), opt(address)]),
};

function makeIdemKey(
  chainId: number,
  vault: Address,
  wallet: Address,
  v: SelectedUnborrow
) {
  return [
    chainId,
    vault.toLowerCase(),
    wallet.toLowerCase(),
    v.positionId.toString(),
    v.slippage.toString(),
    v.deadline.toString(),
  ].join(":");
}

export function useUnborrow(
  selected: SelectedUnborrow | null,
  vault: VaultFullInfo | null,
  { onUnborrowComplete, onUnborrowError, onUnborrowSuccess }: UseUnborrowParams = {}
): UseUnborrowResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const { chainId, address: wallet, publicClient } = useClients();

  const enabled =
    !!selected &&
    !!wallet &&
    !!publicClient &&
    !!vault &&
    selected.chainId === chainId &&
    getAddress(selected.address) === getAddress(vault.address);

  const addr = useMemo(
    () => (selected ? getAddress(selected.address) : undefined),
    [selected]
  );

  const setPhase = (addr: Address, info: Partial<TxInfo>) =>
    setTxState(
      produce(prev => {
        prev[addr] = { ...(prev[addr] as TxInfo | undefined), ...info } as TxInfo;
      })
    );

  const unborrowMutation = useMutation({
    mutationKey: qKeys.unborrow(chainId, addr),
    mutationFn: async (): Promise<UnborrowResult> => {
      const result: UnborrowResult = {};
      if (!enabled || !selected || !addr || !wallet) return result;

      const idemKey = makeIdemKey(chainId!, addr, getAddress(wallet), selected);
      const currentPhase = (txState[addr]?.phase ?? "idle") as TxInfo["phase"];
      const active =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";
      if (active || pendingKey === idemKey) return result;

      if (selected.positionId <= 0n) {
        const e = new Error("Position id must be greater than zero");
        setPhase(addr, { phase: "error", errorMessage: e.message });
        result.error = e;
        onUnborrowError?.(e.message, addr);
        onUnborrowComplete?.(result);
        borrowLogger.error("unborrow failed: invalid position id", {
          vault: addr,
          positionId: selected.positionId.toString(),
        });
        return result;
      }

      setPhase(addr, { phase: "checking" });

      try {
        setPendingKey(idemKey);
        setPhase(addr, { phase: "awaiting-signature" });

        const hash = await vault!.contract.unborrow([
          selected.positionId,
          selected.deadline,
          getSlippageBps(selected.slippage),
        ]);

        setPhase(addr, { phase: "pending", hash });
        result.hash = hash;

        const receipt = await publicClient!.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(addr, { phase: "replaced", hash: r.transaction.hash });
            result.hash = r.transaction.hash;
          },
        });

        if (receipt.status === "success") {
          setPhase(addr, { phase: "success", hash: receipt.transactionHash });
          result.hash = receipt.transactionHash;
          onUnborrowSuccess?.(addr, receipt.transactionHash);
        } else {
          const e = new Error("Transaction reverted");
          setPhase(addr, { phase: "error", errorMessage: e.message });
          result.error = e;
          onUnborrowError?.(e.message, addr);
          borrowLogger.error("unborrow failed: transaction reverted", {
            vault: addr,
            hash,
          });
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase(addr, { phase: "idle" });
          borrowLogger.info("unborrow cancelled by user", { address: addr });
          return result;
        }

        const e = error instanceof Error ? error : new Error("Unknown error");
        setPhase(addr, { phase: "error", errorMessage: e.message });
        result.error = e;
        onUnborrowError?.(e.message, addr);
        loggerMut.error("mutation error (unborrow)", {
          mutationKey: qKeys.unborrow(chainId, addr),
          address: addr,
          error: e,
        });
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onUnborrowComplete?.(result);
      }

      return result;
    },
  });

  const unborrow = unborrowMutation.mutateAsync;

  const allConfirmed =
    Object.keys(txState).length > 0 &&
    Object.values(txState).every(s => s.phase === "success");

  const someError = Object.values(txState).some(s => s.phase === "error");
  const someAwaitingSignature = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

  const reset = () => {
    setTxState({});
    setPendingKey(null);
    unborrowMutation.reset();
  };

  return {
    unborrow,
    reset,
    txState,
    allConfirmed,
    someError,
    someAwaitingSignature,
    isPending: unborrowMutation.isPending,
  };
}

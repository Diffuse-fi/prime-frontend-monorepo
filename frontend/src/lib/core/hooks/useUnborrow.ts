import type { TxInfo, TxState, VaultFullInfo } from "../types";

import { Vault } from "@diffuse/sdk-js";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useMemo, useState } from "react";
import { type Address, getAddress, type Hash } from "viem";

import { trackEvent } from "@/lib/analytics";
import { getSlippageBpsFromKey } from "@/lib/formulas/slippage";
import { makeIdempotencyKey } from "@/lib/misc/idempotency";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { isUserRejectedError } from "../utils/errors";
import { borrowLogger, loggerMut } from "../utils/loggers";

export type SelectedUnborrow = {
  address: Address;
  chainId: number;
  deadline: bigint;
  positionId: bigint;
  slippage: string;
  strategyId: bigint;
};

export type UnborrowResult = {
  error?: Error;
  hash?: Hash;
};

export type UseUnborrowParams = {
  onUnborrowComplete?: (result: UnborrowResult) => void;
  onUnborrowError?: (errorMessage: string, address: Address) => void;
  onUnborrowSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type UseUnborrowResult = {
  allConfirmed: boolean;
  isPending: boolean;
  reset: () => void;
  someAwaitingSignature: boolean;
  someError: boolean;
  txState: TxState;
  unborrow: () => Promise<UnborrowResult>;
};

const ROOT = "unborrow" as const;
const version = QV.borrow;
const qKeys = {
  unborrow: (chainId: number | undefined, address: Address | undefined) =>
    qk([ROOT, version, opt(chainId), opt(address)]),
};

export function useUnborrow(
  selected: null | SelectedUnborrow,
  vault: null | VaultFullInfo,
  { onUnborrowComplete, onUnborrowError, onUnborrowSuccess }: UseUnborrowParams = {}
): UseUnborrowResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingKey, setPendingKey] = useState<null | string>(null);

  const { address: wallet, chainId, publicClient, walletClient } = useClients();

  const enabled =
    !!selected &&
    !!wallet &&
    !!walletClient &&
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

  const vaultContract = useMemo(() => {
    if (!vault || !publicClient) return null;

    return new Vault({
      address: getAddress(vault.address),
      chainId: vault.contract.chainId,
      client: { public: publicClient, wallet: walletClient },
    });
  }, [publicClient, walletClient, vault]);

  const unborrowMutation = useMutation({
    mutationFn: async (): Promise<UnborrowResult> => {
      const result: UnborrowResult = {};
      if (!enabled || !selected || !addr || !wallet || !vaultContract) return result;

      const idemKey = makeIdempotencyKey(
        chainId!,
        addr,
        selected.positionId,
        selected.slippage,
        selected.deadline,
        wallet
      );
      const currentPhase = (txState[addr]?.phase ?? "idle") as TxInfo["phase"];
      const active =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";
      if (active || pendingKey === idemKey) return result;

      if (selected.positionId <= 0n) {
        const e = new Error("Position id must be greater than zero");
        setPhase(addr, { errorMessage: e.message, phase: "error" });
        result.error = e;
        onUnborrowError?.(e.message, addr);
        onUnborrowComplete?.(result);
        borrowLogger.error("unborrow failed: invalid position id", {
          positionId: selected.positionId.toString(),
          vault: addr,
        });
        return result;
      }

      setPhase(addr, { phase: "checking" });

      try {
        setPendingKey(idemKey);
        setPhase(addr, { phase: "awaiting-signature" });
        trackEvent("borrow_cancel_start", {
          chain_id: chainId!,
          position_id: selected.positionId.toString(),
          vault_address: addr,
        });

        const hash = await vaultContract.unborrow([
          selected.positionId,
          selected.strategyId,
          selected.deadline,
          getSlippageBpsFromKey(selected.slippage),
        ]);

        setPhase(addr, { hash, phase: "pending" });
        result.hash = hash;

        const receipt = await publicClient!.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(addr, { hash: r.transaction.hash, phase: "replaced" });
            result.hash = r.transaction.hash;
          },
        });

        if (receipt.status === "success") {
          setPhase(addr, { hash: receipt.transactionHash, phase: "success" });
          result.hash = receipt.transactionHash;
          trackEvent("borrow_cancel_success", {
            chain_id: chainId!,
            position_id: selected.positionId.toString(),
            transaction_hash: receipt.transactionHash,
            vault_address: addr,
          });
          onUnborrowSuccess?.(addr, receipt.transactionHash);
        } else {
          const e = new Error("Transaction reverted");
          setPhase(addr, { errorMessage: e.message, phase: "error" });
          result.error = e;
          trackEvent("borrow_cancel_error", {
            chain_id: chainId!,
            error_message: e.message,
            position_id: selected.positionId.toString(),
            vault_address: addr,
          });
          onUnborrowError?.(e.message, addr);
          borrowLogger.error("unborrow failed: transaction reverted", {
            hash,
            vault: addr,
          });
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase(addr, { phase: "idle" });
          trackEvent("borrow_cancel_rejected", {
            chain_id: chainId!,
            position_id: selected.positionId.toString(),
            vault_address: addr,
          });
          borrowLogger.info("unborrow cancelled by user", { address: addr });
          return result;
        }

        const e = error instanceof Error ? error : new Error("Unknown error");
        setPhase(addr, { errorMessage: e.message, phase: "error" });
        result.error = e;
        trackEvent("borrow_cancel_error", {
          chain_id: chainId!,
          error_message: e.message,
          position_id: selected.positionId.toString(),
          vault_address: addr,
        });
        onUnborrowError?.(e.message, addr);
        loggerMut.error("mutation error (unborrow)", {
          address: addr,
          error: e,
          mutationKey: qKeys.unborrow(chainId, addr),
        });
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onUnborrowComplete?.(result);
      }

      return result;
    },
    mutationKey: qKeys.unborrow(chainId, addr),
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
    allConfirmed,
    isPending: unborrowMutation.isPending,
    reset,
    someAwaitingSignature,
    someError,
    txState,
    unborrow,
  };
}

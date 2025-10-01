import { useMemo, useState } from "react";
import { getAddress, type Address, type Hash } from "viem";
import { useClients } from "../../wagmi/useClients";
import type { TxInfo, TxState, VaultFullInfo } from "../types";
import { useMutation } from "@tanstack/react-query";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { produce } from "immer";

export type SelectedBorrow = {
  chainId: number;
  address: Address;
  strategyId: bigint;
  collateralType: number;
  collateralAmount: bigint;
  assetsToBorrow: bigint;
  liquidationPrice: bigint;
  minStrategyToReceive: bigint;
  deadline: bigint;
  assetDecimals?: number;
  assetSymbol?: string;
};

export type UseBorrowParams = {
  onBorrowComplete?: (result: BorrowResult) => void;
  onBorrowError?: (errorMessage: string, address: Address) => void;
  onBorrowSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type BorrowResult = {
  hash?: Hash;
  error?: Error;
};

export type UseBorrowResult = {
  borrow: () => Promise<BorrowResult>;
  reset: () => void;
  txState: TxState;
  allConfirmed: boolean;
  someError: boolean;
  someAwaitingSignature: boolean;
  isPending: boolean;
};

const ROOT = "borrow" as const;
const version = QV.borrow;
const qKeys = {
  borrow: (chainId: number | undefined, address: Address | undefined) =>
    qk([ROOT, version, opt(chainId), opt(address)]),
};

function makeIdemKey(
  chainId: number,
  vault: Address,
  wallet: Address,
  v: SelectedBorrow
) {
  return [
    chainId,
    vault.toLowerCase(),
    wallet.toLowerCase(),
    v.strategyId.toString(),
    v.collateralType.toString(),
    v.collateralAmount.toString(),
    v.assetsToBorrow.toString(),
    v.liquidationPrice.toString(),
    v.minStrategyToReceive.toString(),
    v.deadline.toString(),
  ].join(":");
}

export function useBorrow(
  selected: SelectedBorrow | null,
  vault: VaultFullInfo | null,
  { onBorrowComplete, onBorrowError, onBorrowSuccess }: UseBorrowParams = {}
): UseBorrowResult {
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

  const borrowMutation = useMutation({
    mutationKey: qKeys.borrow(chainId, addr),
    mutationFn: async (): Promise<BorrowResult> => {
      const result: BorrowResult = {};

      if (!enabled || !selected || !addr || !wallet) return result;

      const idemKey = makeIdemKey(chainId!, addr, getAddress(wallet), selected);
      const currentPhase = (txState[addr]?.phase ?? "idle") as TxInfo["phase"];
      const active =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";
      if (active || pendingKey === idemKey) return result;

      if (selected.collateralAmount <= 0n) {
        const e = new Error("Collateral must be greater than zero");
        setPhase(addr, { phase: "error", errorMessage: e.message });
        result.error = e;
        onBorrowError?.(e.message, addr);
        onBorrowComplete?.(result);
        return result;
      }
      if (selected.assetsToBorrow <= 0n) {
        const e = new Error("Borrow amount must be greater than zero");
        setPhase(addr, { phase: "error", errorMessage: e.message });
        result.error = e;
        onBorrowError?.(e.message, addr);
        onBorrowComplete?.(result);
        return result;
      }

      setPhase(addr, { phase: "checking" });

      try {
        setPendingKey(idemKey);
        setPhase(addr, { phase: "awaiting-signature" });

        const hash = await vault.contract.borrowRequest([
          selected.strategyId,
          selected.collateralType,
          selected.collateralAmount,
          selected.assetsToBorrow,
          selected.liquidationPrice,
          selected.minStrategyToReceive,
          selected.deadline,
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
          onBorrowSuccess?.(addr, receipt.transactionHash);
        } else {
          const e = new Error("Transaction reverted");
          setPhase(addr, { phase: "error", errorMessage: e.message });
          result.error = e;
          onBorrowError?.(e.message, addr);
        }
      } catch (error) {
        const e = error instanceof Error ? error : new Error("Unknown error");
        setPhase(addr, { phase: "error", errorMessage: e.message });
        result.error = e;
        onBorrowError?.(e.message, addr);
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onBorrowComplete?.(result);
      }

      return result;
    },
  });

  const borrow = borrowMutation.mutateAsync;

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
    borrowMutation.reset();
  };

  return {
    borrow,
    reset,
    txState,
    allConfirmed,
    someError,
    someAwaitingSignature,
    isPending: borrowMutation.isPending,
  };
}

import { useMemo, useState } from "react";
import { getAddress, type Address, type Hash } from "viem";
import { useClients } from "../../wagmi/useClients";
import type { TxInfo, TxState, VaultFullInfo } from "../types";
import { useMutation } from "@tanstack/react-query";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { produce } from "immer";
import { calcBorrowingFactor } from "@/lib/formulas/borrow";
import { applySlippage } from "@/lib/formulas/slippage";
import { isUserRejectedError } from "../utils/errors";
import { borrowLogger, loggerMut } from "../utils/loggers";

export type SelectedBorrow = {
  chainId: number;
  address: Address;
  strategyId: bigint;
  collateralType: number;
  collateralAmount: bigint;
  assetsToBorrow: bigint;
  slippage: string;
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
    v.slippage.toString(),
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
        borrowLogger.warn("borrow error", { address: addr, reason: e.message });
        return result;
      }

      setPhase(addr, { phase: "checking" });

      try {
        setPendingKey(idemKey);
        setPhase(addr, { phase: "awaiting-signature" });

        const strategy = vault.strategies.find(s => s.id === selected.strategyId);
        if (!strategy) {
          const e = new Error("Strategy not found");
          setPhase(addr, { phase: "error", errorMessage: e.message });
          result.error = e;
          onBorrowError?.(e.message, addr);
          borrowLogger.warn("borrow error", { address: addr, reason: e.message });
          return result;
        }

        const borrowingFactor = calcBorrowingFactor(
          strategy.apr,
          vault.feeData.spreadFee,
          BigInt(Math.max(0, Number(strategy.endDate) - Math.floor(Date.now() / 1000)))
        );

        const predictedTokensToReceive = await vault.contract.previewBorrow([
          wallet,
          selected.strategyId,
          selected.collateralType,
          selected.collateralAmount,
          selected.assetsToBorrow,
        ]);

        const WAD = 10n ** 18n;
        const mulWad = (x: bigint, y: bigint) => (x * y) / WAD;
        const divWad = (x: bigint, y: bigint) => (x * WAD) / y;

        const toWad = (x: number) => {
          const s = x.toString();
          const [i, f = ""] = s.split(".");
          const frac = (f + "0".repeat(18)).slice(0, 18);
          return BigInt(i) * WAD + BigInt(frac);
        };

        const denom = selected.assetsToBorrow + selected.collateralAmount;
        if (denom === 0n) throw new Error("Zero denominator");

        const assetDec = selected.assetDecimals ?? vault.assets[0].decimals;
        const stratDec = strategy.token.decimals;

        const factorWad = toWad(1 + Number(borrowingFactor) / 10_000);

        const borrowedShareWad = divWad(selected.assetsToBorrow, denom);

        const totalPredictedTokensToReceive = predictedTokensToReceive.reduce(
          (acc, value) => acc + value,
          0n
        );

        const depositPriceWad =
          totalPredictedTokensToReceive === 0n
            ? 0n
            : (totalPredictedTokensToReceive * WAD * 10n ** BigInt(assetDec)) /
              (denom * 10n ** BigInt(stratDec));

        const resultWad =
          depositPriceWad === 0n
            ? 0n
            : divWad(mulWad(factorWad, borrowedShareWad), depositPriceWad);

        const minStrategyToReceive = predictedTokensToReceive.map(amount =>
          applySlippage(amount, selected.slippage)
        );

        const hash = await vault.contract.borrowRequest([
          selected.strategyId,
          selected.collateralType,
          selected.collateralAmount,
          selected.assetsToBorrow,
          resultWad,
          minStrategyToReceive,
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
          borrowLogger.warn("borrow error", { address: addr, reason: e.message });
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase(addr, { phase: "idle" });
          borrowLogger.info("borrow request cancelled by user", { address: addr });
          return result;
        }

        const e = error instanceof Error ? error : new Error("Unknown error");
        setPhase(addr, { phase: "error", errorMessage: e.message });
        result.error = e;
        onBorrowError?.(e.message, addr);
        loggerMut.error("mutation error (borrow)", {
          mutationKey: qKeys.borrow(chainId, addr),
          address: addr,
          error: e,
        });
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

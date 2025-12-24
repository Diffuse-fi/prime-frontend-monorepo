import type { TxInfo, TxState, VaultFullInfo } from "../types";

import { applySlippageBpsArray } from "@diffuse/sdk-js";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useMemo, useState } from "react";
import { type Address, getAddress, type Hash } from "viem";

import { trackEvent } from "@/lib/analytics";
import { getPtAmount } from "@/lib/api/pt";
import { calcBorrowingFactor } from "@/lib/formulas/borrow";
import { getSlippageBpsFromKey } from "@/lib/formulas/slippage";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { isUserRejectedError } from "../utils/errors";
import { borrowLogger, loggerMut } from "../utils/loggers";

export type BorrowResult = {
  error?: Error;
  hash?: Hash;
};

export type SelectedBorrow = {
  address: Address;
  assetDecimals?: number;
  assetsToBorrow: bigint;
  assetSymbol?: string;
  chainId: number;
  collateralAmount: bigint;
  collateralType: number;
  deadline: bigint;
  slippage: string;
  strategyId: bigint;
};

export type UseBorrowParams = {
  onBorrowComplete?: (result: BorrowResult) => void;
  onBorrowError?: (errorMessage: string, address: Address) => void;
  onBorrowSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type UseBorrowResult = {
  allConfirmed: boolean;
  borrow: () => Promise<BorrowResult>;
  isPending: boolean;
  reset: () => void;
  someAwaitingSignature: boolean;
  someError: boolean;
  txState: TxState;
};

const ROOT = "borrow" as const;
const version = QV.borrow;
const qKeys = {
  borrow: (chainId: number | undefined, address: Address | undefined) =>
    qk([ROOT, version, opt(chainId), opt(address)]),
};

const WAD = 10n ** 18n;
const mulWad = (x: bigint, y: bigint) => (x * y) / WAD;
const divWad = (x: bigint, y: bigint) => (x * WAD) / y;

export function useBorrow(
  selected: null | SelectedBorrow,
  vault: null | VaultFullInfo,
  { onBorrowComplete, onBorrowError, onBorrowSuccess }: UseBorrowParams = {}
): UseBorrowResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingKey, setPendingKey] = useState<null | string>(null);

  const { address: wallet, chainId, publicClient } = useClients();

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

  const setPhase = (addr0: Address, info: Partial<TxInfo>) =>
    setTxState(
      produce(prev => {
        prev[addr0] = { ...(prev[addr0] as TxInfo | undefined), ...info } as TxInfo;
      })
    );

  const borrowMutation = useMutation({
    // eslint-disable-next-line sonarjs/cognitive-complexity
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
        setPhase(addr, { errorMessage: e.message, phase: "error" });
        result.error = e;
        onBorrowError?.(e.message, addr);
        onBorrowComplete?.(result);
        return result;
      }

      if (selected.assetsToBorrow <= 0n) {
        const e = new Error("Borrow amount must be greater than zero");
        setPhase(addr, { errorMessage: e.message, phase: "error" });
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
          setPhase(addr, { errorMessage: e.message, phase: "error" });
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

        const assetDec = selected.assetDecimals ?? vault.assets[0].decimals;
        const stratDec = strategy.token.decimals;

        const factorWad = factorWadFromBps(borrowingFactor);

        let predictedRouteAmounts: readonly bigint[];
        let totalStrategyTokens: bigint;
        let denomBase: bigint;
        let collateralValueBase: bigint;

        if (selected.collateralType === 1) {
          const sim = await getPtAmount({
            strategy_id: selected.strategyId.toString(),
            usdc_amount: selected.assetsToBorrow.toString(),
            vault_address: addr,
          });

          if (!sim.finished) {
            throw new Error("PT simulation not finished");
          }

          predictedRouteAmounts = sim.amounts.map(BigInt);
          const ptOut = predictedRouteAmounts.at(-1);
          if (ptOut === undefined) {
            throw new Error("PT simulation returned empty amounts");
          }

          totalStrategyTokens = ptOut + selected.collateralAmount;

          collateralValueBase =
            ptOut === 0n
              ? 0n
              : (selected.collateralAmount * selected.assetsToBorrow) / ptOut;

          denomBase = selected.assetsToBorrow + collateralValueBase;
        } else {
          predictedRouteAmounts = await vault.contract.previewBorrow([
            wallet,
            selected.strategyId,
            selected.collateralType,
            selected.collateralAmount,
            selected.assetsToBorrow,
          ]);

          const routeSum = predictedRouteAmounts.reduce((acc, v) => acc + v, 0n);
          totalStrategyTokens = routeSum;

          collateralValueBase = selected.collateralAmount;
          denomBase = selected.assetsToBorrow + selected.collateralAmount;
        }

        const leverage =
          collateralValueBase === 0n
            ? 0
            : Number(selected.assetsToBorrow + collateralValueBase) /
              Number(collateralValueBase);

        trackEvent("borrow_request_start", {
          amount: selected.assetsToBorrow.toString(),
          asset_symbol: selected.assetSymbol,
          chain_id: chainId!,
          leverage,
          vault_address: addr,
        });

        if (denomBase === 0n) throw new Error("Zero denominator");

        const borrowedShareWad = divWad(selected.assetsToBorrow, denomBase);

        const depositPriceWad =
          totalStrategyTokens === 0n
            ? 0n
            : (totalStrategyTokens * WAD * 10n ** BigInt(assetDec)) /
              (denomBase * 10n ** BigInt(stratDec));

        const resultWad =
          depositPriceWad === 0n
            ? 0n
            : divWad(mulWad(factorWad, borrowedShareWad), depositPriceWad);

        const bps = getSlippageBpsFromKey(selected.slippage);
        const minStrategyToReceive = applySlippageBpsArray(
          predictedRouteAmounts,
          bps,
          "down"
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
          trackEvent("borrow_request_success", {
            amount: selected.assetsToBorrow.toString(),
            asset_symbol: selected.assetSymbol,
            chain_id: chainId!,
            leverage,
            transaction_hash: receipt.transactionHash,
            vault_address: addr,
          });
          onBorrowSuccess?.(addr, receipt.transactionHash);
        } else {
          const e = new Error("Transaction reverted");
          setPhase(addr, { errorMessage: e.message, phase: "error" });
          result.error = e;
          trackEvent("borrow_request_error", {
            amount: selected.assetsToBorrow.toString(),
            asset_symbol: selected.assetSymbol,
            chain_id: chainId!,
            error_message: e.message,
            vault_address: addr,
          });
          onBorrowError?.(e.message, addr);
          borrowLogger.warn("borrow error", { address: addr, reason: e.message });
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase(addr, { phase: "idle" });
          trackEvent("borrow_request_rejected", {
            amount: selected.assetsToBorrow.toString(),
            asset_symbol: selected.assetSymbol,
            chain_id: chainId!,
            vault_address: addr,
          });
          borrowLogger.info("borrow request cancelled by user", { address: addr });
          return result;
        }

        const e = error instanceof Error ? error : new Error("Unknown error");
        setPhase(addr, { errorMessage: e.message, phase: "error" });
        result.error = e;
        trackEvent("borrow_request_error", {
          amount: selected.assetsToBorrow.toString(),
          asset_symbol: selected.assetSymbol,
          chain_id: chainId!,
          error_message: e.message,
          vault_address: addr,
        });
        onBorrowError?.(e.message, addr);
        loggerMut.error("mutation error (borrow)", {
          address: addr,
          error: e,
          mutationKey: qKeys.borrow(chainId, addr),
        });
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onBorrowComplete?.(result);
      }

      return result;
    },
    mutationKey: qKeys.borrow(chainId, addr),
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
    allConfirmed,
    borrow,
    isPending: borrowMutation.isPending,
    reset,
    someAwaitingSignature,
    someError,
    txState,
  };
}

function factorWadFromBps(bps: bigint | number): bigint {
  const b = toBpsBigint(bps);
  return (WAD * (10_000n + b)) / 10_000n;
}

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

function toBpsBigint(v: bigint | number): bigint {
  if (typeof v === "bigint") return v;
  if (!Number.isFinite(v)) return 0n;
  return BigInt(Math.floor(v));
}

import type { VaultFullInfo } from "../types";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { type Address, getAddress } from "viem";

import { aegisMint } from "@/lib/api/aegisMint";
import { previewBorrow } from "@/lib/api/previewBorrow";
import { getPtAmount } from "@/lib/api/pt";
import { calcBorrowingFactor } from "@/lib/formulas/borrow";

import { isAegisStrategy } from "../../aegis";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";

export type SelectedBorrow = {
  address: Address;
  assetDecimals: number;
  assetsToBorrow: bigint;
  assetSymbol?: string;
  chainId: number;
  collateralAmount: bigint;
  collateralType: number;
  deadline: bigint;
  slippage: string;
  strategyId: bigint;
};

const ROOT = "borrowPreview" as const;
const version = QV.borrow;

const WAD = 10n ** 18n;
const LTV_WAD = 950_000_000_000_000_000n; // const 95%
const mulWad = (x: bigint, y: bigint) => (x * y) / WAD;
const divWad = (x: bigint, y: bigint) => (x * WAD) / y;

export function useBorrowPreview(
  selected: null | SelectedBorrow,
  vault: null | VaultFullInfo
) {
  const { address: wallet, chainId } = useClients();

  const addr = useMemo(
    () => (selected ? getAddress(selected.address) : undefined),
    [selected]
  );

  const enabled =
    !!selected &&
    !!wallet &&
    !!vault &&
    selected.chainId === chainId &&
    addr === getAddress(vault.address) &&
    selected.collateralAmount > 0n &&
    selected.assetsToBorrow > 0n;

  const queryKey = useMemo(
    () =>
      qk([
        ROOT,
        version,
        opt(chainId),
        opt(addr),
        opt(selected?.strategyId?.toString()),
        opt(selected?.collateralType?.toString()),
        opt(selected?.collateralAmount?.toString()),
        opt(selected?.assetsToBorrow?.toString()),
      ]),
    [addr, chainId, selected]
  );

  const { data, error, isFetching, isLoading, isPending } = useQuery({
    enabled,
    gcTime: 5 * 60 * 1000,
    queryFn: async ({ signal }) => {
      if (!enabled || !selected || !vault || !addr) {
        return {
          liquidationPriceWad: undefined,
          predictedTokensToReceive: undefined,
        };
      }

      const strategy = vault.strategies.find(s => s.id === selected.strategyId);
      if (!strategy) throw new Error("Strategy not found");

      const assetDec = selected.assetDecimals;
      const stratDec = strategy.token.decimals;
      const factorWad = calcFactorWad(
        strategy.apr,
        vault.feeData.spreadFee,
        strategy.endDate,
        vault.feeData.liquidationFee,
        vault.feeData.earlyWithdrawalFee
      );

      if (selected.collateralType === 1) {
        const sim = await getPtAmount(
          {
            strategy_id: selected.strategyId.toString(),
            usdc_amount: selected.assetsToBorrow.toString(),
            vault_address: addr,
          },
          { signal }
        );

        if (!sim.finished) throw new Error("PT simulation not finished");

        const ptOut = lastBigInt(sim.amounts, "PT simulation returned empty amounts");
        const totalPt = ptOut + selected.collateralAmount;

        if (ptOut === 0n) {
          return { liquidationPriceWad: 0n, predictedTokensToReceive: totalPt };
        }

        const collateralValueBase =
          (selected.collateralAmount * selected.assetsToBorrow) / ptOut;

        const denomBase = selected.assetsToBorrow + collateralValueBase;

        return {
          liquidationPriceWad: calcLiquidationPriceWad({
            assetDec,
            borrowedAmount: selected.assetsToBorrow,
            denomBase,
            factorWad,
            predictedTokensToReceive: totalPt,
            stratDec,
          }),
          predictedTokensToReceive: totalPt,
        };
      }

      let dataForPreview = "0x";

      if (isAegisStrategy(strategy) && selected.collateralType !== 1) {
        const collateral_asset = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

        const mint = await aegisMint(
          {
            collateral_amount: selected.collateralAmount.toString(),
            collateral_asset,
            slippage: parseSlippage(selected.slippage),
          },
          { signal }
        );

        dataForPreview = mint.encodedData;
      }

      const sim = await previewBorrow(
        {
          assets_to_borrow: selected.assetsToBorrow.toString(),
          collateral_amount: selected.collateralAmount.toString(),
          collateral_type: selected.collateralType.toString(),
          data: dataForPreview,
          strategy_id: selected.strategyId.toString(),
          vault_address: addr,
        },
        { signal }
      );

      const predictedTokensToReceive = lastBigInt(
        sim.assetsReceived,
        "previewBorrow returned empty assetsReceived"
      );

      const denomBase = selected.collateralAmount + selected.assetsToBorrow;

      return {
        liquidationPriceWad: calcLiquidationPriceWad({
          assetDec,
          borrowedAmount: selected.assetsToBorrow,
          denomBase,
          factorWad,
          predictedTokensToReceive,
          stratDec,
        }),
        predictedTokensToReceive,
      };
    },
    queryKey,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return {
    error: error ?? null,
    isFetching,
    isLoading,
    isPending,
    liquidationPriceWad: data?.liquidationPriceWad,
    predictedTokensToReceive: data?.predictedTokensToReceive,
  };
}

function calcFactorWad(
  apr: bigint,
  spreadFee: number,
  endDate: bigint,
  liquidationFee: number,
  earlyWithdrawalFee: number
): bigint {
  const secondsLeft = Math.max(0, Number(endDate) - Math.floor(Date.now() / 1000));
  const bpsRaw = calcBorrowingFactor(apr, spreadFee, BigInt(secondsLeft));
  const bps = typeof bpsRaw === "bigint" ? bpsRaw : BigInt(Math.floor(Number(bpsRaw)));
  const borrowingFactorWad = (bps * WAD) / 10_000n;

  const protocolMaxFee = Math.max(liquidationFee, earlyWithdrawalFee);
  const protocolMaxFeeWad = (BigInt(protocolMaxFee) * WAD) / 10_000n;

  return WAD + borrowingFactorWad + protocolMaxFeeWad;
}

function calcLiquidationPriceWad(args: {
  assetDec: number;
  borrowedAmount: bigint;
  denomBase: bigint;
  factorWad: bigint;
  predictedTokensToReceive: bigint;
  stratDec: number;
}) {
  const {
    assetDec,
    borrowedAmount,
    denomBase,
    factorWad,
    predictedTokensToReceive,
    stratDec,
  } = args;

  if (denomBase === 0n) return 0n;

  const borrowedShareWad = divWad(borrowedAmount, denomBase);

  const depositPriceWad =
    predictedTokensToReceive === 0n
      ? 0n
      : (predictedTokensToReceive * WAD * 10n ** BigInt(assetDec)) /
        (denomBase * 10n ** BigInt(stratDec));

  const liquidationPriceBeforeLtv =
    depositPriceWad === 0n
      ? 0n
      : divWad(mulWad(factorWad, borrowedShareWad), depositPriceWad);

  return divWad(liquidationPriceBeforeLtv, LTV_WAD);
}

function lastBigInt(xs: string[], err: string) {
  const v = xs.at(-1);
  if (!v) throw new Error(err);
  return BigInt(v);
}

function parseSlippage(slippage: string): number {
  const n = Number(slippage);
  if (!Number.isFinite(n) || n < 0) throw new Error("Invalid slippage");

  return Math.max(0, n * 100);
}

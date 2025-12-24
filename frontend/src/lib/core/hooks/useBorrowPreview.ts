import type { VaultFullInfo } from "../types";

import { Viewer } from "@diffuse/sdk-js";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { type Address, getAddress } from "viem";

import { getPtAmount } from "@/lib/api/pt";
import { calcBorrowingFactor } from "@/lib/formulas/borrow";

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
const mulWad = (x: bigint, y: bigint) => (x * y) / WAD;
const divWad = (x: bigint, y: bigint) => (x * WAD) / y;

export function useBorrowPreview(
  selected: null | SelectedBorrow,
  vault: null | VaultFullInfo
) {
  const { address: wallet, chainId, publicClient } = useClients();

  const viewer = useMemo(() => {
    if (!publicClient || !chainId) return null;
    return new Viewer({
      chainId,
      client: { public: publicClient },
    });
  }, [publicClient, chainId]);

  const addr = useMemo(
    () => (selected ? getAddress(selected.address) : undefined),
    [selected]
  );

  const enabled =
    !!selected &&
    !!wallet &&
    !!publicClient &&
    !!viewer &&
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
    queryFn: async ({ signal }) => {
      if (!enabled || !selected || !vault || !wallet || !viewer) {
        return {
          liquidationPriceWad: undefined,
          predictedTokensToReceive: undefined,
        };
      }

      const strategy = vault.strategies.find(s => s.id === selected.strategyId);
      if (!strategy) throw new Error("Strategy not found");

      const assetDec = selected.assetDecimals;
      const stratDec = strategy.token.decimals;

      const secondsLeft = Math.max(
        0,
        Number(strategy.endDate) - Math.floor(Date.now() / 1000)
      );

      const borrowingFactorBpsRaw = calcBorrowingFactor(
        strategy.apr,
        vault.feeData.spreadFee,
        BigInt(secondsLeft)
      );

      const borrowingFactorBps =
        typeof borrowingFactorBpsRaw === "bigint"
          ? borrowingFactorBpsRaw
          : BigInt(Math.floor(Number(borrowingFactorBpsRaw)));

      const borrowingFactorWad = (borrowingFactorBps * WAD) / 10_000n;
      const factorWad = WAD + borrowingFactorWad;

      if (selected.collateralType === 1) {
        const sim = await getPtAmount(
          {
            strategy_id: selected.strategyId.toString(),
            usdc_amount: selected.assetsToBorrow.toString(),
            vault_address: addr!,
          },
          { signal }
        );

        if (!sim.finished) {
          throw new Error("PT simulation not finished");
        }

        const last = sim.amounts.at(-1);
        if (!last) {
          throw new Error("PT simulation returned empty amounts");
        }

        const ptOut = BigInt(last);
        console.log({
          assetsToBorrow: selected.assetsToBorrow,
          collateralAmount: selected.collateralAmount,
          ptOut,
        });
        const totalPt = ptOut + selected.collateralAmount;

        if (ptOut === 0n) {
          return { liquidationPriceWad: 0n, predictedTokensToReceive: totalPt };
        }

        const collateralValueBase =
          (selected.collateralAmount * selected.assetsToBorrow) / ptOut;

        const denomBase = selected.assetsToBorrow + collateralValueBase;

        if (denomBase === 0n) {
          return { liquidationPriceWad: 0n, predictedTokensToReceive: totalPt };
        }

        const borrowedShareWad = divWad(selected.assetsToBorrow, denomBase);

        const depositPriceWad =
          totalPt === 0n
            ? 0n
            : (totalPt * WAD * 10n ** BigInt(assetDec)) /
              (denomBase * 10n ** BigInt(stratDec));

        const liquidationPriceWad =
          depositPriceWad === 0n
            ? 0n
            : divWad(mulWad(factorWad, borrowedShareWad), depositPriceWad);

        return { liquidationPriceWad, predictedTokensToReceive: totalPt };
      }

      const [baseAssetAmount, strategyAssetAmount] = await viewer.previewEnterStrategy(
        addr!,
        selected.strategyId,
        { signal }
      );

      const baseAssetUnits = (baseAssetAmount * 1_000_000n) / 10n ** BigInt(assetDec);

      const strategyAssetUnits =
        (strategyAssetAmount * 1_000_000n) / 10n ** BigInt(stratDec);

      const price =
        baseAssetUnits === 0n ? 0 : Number(strategyAssetUnits) / Number(baseAssetUnits);

      const predictedTokensToReceive =
        ((((selected.assetsToBorrow + selected.collateralAmount) *
          BigInt(Math.floor(price * 1_000_000))) /
          1_000_000n) *
          10n ** BigInt(stratDec)) /
        10n ** BigInt(assetDec);

      const denom = selected.collateralAmount + selected.assetsToBorrow;

      if (denom === 0n) {
        return { liquidationPriceWad: 0n, predictedTokensToReceive };
      }

      const borrowedShareWad = divWad(selected.assetsToBorrow, denom);

      const depositPriceWad =
        predictedTokensToReceive === 0n
          ? 0n
          : (predictedTokensToReceive * WAD * 10n ** BigInt(assetDec)) /
            (denom * 10n ** BigInt(stratDec));

      const liquidationPriceWad =
        depositPriceWad === 0n
          ? 0n
          : divWad(mulWad(factorWad, borrowedShareWad), depositPriceWad);

      return { liquidationPriceWad, predictedTokensToReceive };
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

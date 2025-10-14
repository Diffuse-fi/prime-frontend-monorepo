import { useMemo } from "react";
import { getAddress, type Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useClients } from "../../wagmi/useClients";
import type { VaultFullInfo } from "../types";
import { QV } from "../../query/versions";
import { opt, qk } from "../../query/helpers";
import { calcBorrowingFactor } from "@/lib/formulas/borrow";
import { Viewer } from "@diffuse/sdk-js";

export type SelectedBorrow = {
  chainId: number;
  address: Address;
  strategyId: bigint;
  collateralType: number;
  collateralAmount: bigint;
  assetsToBorrow: bigint;
  slippage: string;
  deadline: bigint;
  assetDecimals: number;
  assetSymbol?: string;
};

const ROOT = "borrowPreview" as const;
const version = QV.borrow;

const WAD = 10n ** 18n;
const mulWad = (x: bigint, y: bigint) => (x * y) / WAD;
const divWad = (x: bigint, y: bigint) => (x * WAD) / y;

export function useBorrowPreview(
  selected: SelectedBorrow | null,
  vault: VaultFullInfo | null
) {
  const { chainId, address: wallet, publicClient } = useClients();

  const viewer = useMemo(() => {
    if (!publicClient || !chainId) return null;
    return new Viewer({
      client: { public: publicClient },
      chainId,
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

  const { data, isLoading, isPending, isFetching, error } = useQuery({
    queryKey,
    enabled,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      if (!enabled || !selected || !vault || !wallet || !viewer) {
        return { predictedTokensToReceive: undefined, liquidationPriceWad: undefined };
      }

      const strategy = vault.strategies.find(s => s.id === selected.strategyId);
      if (!strategy) throw new Error("Strategy not found");

      const [baseAssetAmount, strategyAssetAmount] = await viewer.previewEnterStrategy(
        addr!,
        selected.strategyId,
        { signal }
      );

      const baseAssetUnits =
        (baseAssetAmount * 1000000n) / 10n ** BigInt(selected.assetDecimals);
      const strategyAssetUnits =
        (strategyAssetAmount * 1000000n) / 10n ** BigInt(strategy.token.decimals);

      const price =
        baseAssetUnits === 0n ? 0 : Number(strategyAssetUnits) / Number(baseAssetUnits);

      const predictedTokensToReceive =
        ((((selected.assetsToBorrow + selected.collateralAmount) *
          BigInt(Math.floor(price * 1_000_000))) /
          1_000_000n) *
          10n ** BigInt(strategy.token.decimals)) /
        10n ** BigInt(selected.assetDecimals);

      const denom = selected.collateralAmount + selected.assetsToBorrow;

      if (denom === 0n) {
        return { predictedTokensToReceive, liquidationPriceWad: 0n };
      }

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

      const totalBase = selected.assetsToBorrow + selected.collateralAmount;
      const borrowedShareWad =
        totalBase === 0n ? 0n : divWad(selected.assetsToBorrow, totalBase);

      const depositPriceWad =
        predictedTokensToReceive === 0n
          ? 0n
          : (predictedTokensToReceive * WAD * 10n ** BigInt(assetDec)) /
            (denom * 10n ** BigInt(stratDec));

      const liquidationPriceWad =
        depositPriceWad === 0n
          ? 0n
          : divWad(mulWad(factorWad, borrowedShareWad), depositPriceWad);

      return { predictedTokensToReceive, liquidationPriceWad };
    },
  });

  return {
    predictedTokensToReceive: data?.predictedTokensToReceive,
    liquidationPriceWad: data?.liquidationPriceWad,
    isLoading,
    isPending,
    isFetching,
    error: error ?? null,
  };
}

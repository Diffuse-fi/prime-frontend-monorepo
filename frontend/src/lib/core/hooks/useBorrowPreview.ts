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
  assetDecimals?: number;
  assetSymbol?: string;
};

const ROOT = "borrowPreview" as const;
const version = QV.borrow;

const WAD = 10n ** 18n;
const mulWad = (x: bigint, y: bigint) => (x * y) / WAD;
const divWad = (x: bigint, y: bigint) => (x * WAD) / y;
const toWad = (x: number) => {
  const s = x.toString();
  const [i, f = ""] = s.split(".");
  const frac = (f + "0".repeat(18)).slice(0, 18);
  return BigInt(i) * WAD + BigInt(frac);
};

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

      const coefficient = strategyAssetAmount / baseAssetAmount;
      const predictedTokensToReceive = selected.assetsToBorrow * coefficient;

      const denom = baseAssetAmount;

      if (denom === 0n) {
        return { predictedTokensToReceive, liquidationPriceWad: 0n };
      }

      const assetDec = selected.assetDecimals ?? vault.assets[0].decimals;
      const stratDec = strategy.token.decimals;

      const secondsLeft = Math.max(
        0,
        Number(strategy.endDate) - Math.floor(Date.now() / 1000)
      );

      const borrowingFactor = calcBorrowingFactor(
        strategy.apr,
        vault.spreadFee,
        BigInt(secondsLeft)
      );

      const factorWad = toWad(1 + Number(borrowingFactor) / 10_000);
      const borrowedShareWad = divWad(
        selected.assetsToBorrow,
        selected.assetsToBorrow + selected.collateralAmount
      );

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

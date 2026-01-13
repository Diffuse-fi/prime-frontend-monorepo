import { AssetInfo } from "@diffuse/config";
import { useMemo } from "react";
import { getAddress } from "viem";

import { usePtBuyBSLow } from "@/lib/core/hooks/usePtBuyBsLow";
import { Strategy, VaultFullInfo } from "@/lib/core/types";

export function useCollateralInSelectedAsset(args: {
  collateralAmount: bigint;
  collateralAsset: AssetInfo;
  enabled?: boolean;
  selectedAsset: AssetInfo;
  strategy: Strategy;
  vault: VaultFullInfo;
}) {
  const {
    collateralAmount,
    collateralAsset,
    enabled = true,
    selectedAsset,
    strategy,
    vault,
  } = args;
  const collateralAddress = getAddress(collateralAsset.address);
  const selectedAssetAddress = getAddress(selectedAsset.address);
  const strategyAssetAddress = getAddress(strategy.token.address);
  const isSelectedCollateral = collateralAddress === selectedAssetAddress;
  const isStrategyCollateral = collateralAddress === strategyAssetAddress;
  const shouldSimulate = enabled && isStrategyCollateral && collateralAmount > 0n;
  const ptBuy = usePtBuyBSLow({
    amount: shouldSimulate ? collateralAmount : undefined,
    enabled: shouldSimulate,
    strategyId: strategy.id,
    vaultAddress: vault.address,
  });

  const amount = useMemo(() => {
    if (isSelectedCollateral) return collateralAmount;
    if (!isStrategyCollateral) return null;
    if (collateralAmount <= 0n) return 0n;
    if (ptBuy.amountOut === undefined) return null;

    return ptBuy.amountOut;
  }, [
    collateralAmount,
    isSelectedCollateral,
    isStrategyCollateral,
    ptBuy.amountOut,
  ]);

  return {
    amount,
    error: ptBuy.error,
    isLoading: ptBuy.isLoading,
    isSelectedCollateral,
    isStrategyCollateral,
  };
}

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { type Address, getAddress } from "viem";

import { getPtBuyBSLow } from "@/lib/api/pt";
import { opt, qk } from "@/lib/query/helpers";
import { QV } from "@/lib/query/versions";

const ROOT = "ptBuyBSLow" as const;
const version = QV.ptBuyBSLow;

export function usePtBuyBSLow(args: {
  amount: bigint | undefined;
  enabled?: boolean;
  strategyId: bigint | null | undefined;
  vaultAddress: Address | string | undefined;
}) {
  const { amount, enabled = true, strategyId, vaultAddress } = args;
  const normalizedVaultAddress = useMemo(
    () => (vaultAddress ? getAddress(vaultAddress) : undefined),
    [vaultAddress]
  );
  const active =
    enabled &&
    amount !== undefined &&
    amount > 0n &&
    strategyId !== null &&
    strategyId !== undefined &&
    !!normalizedVaultAddress;

  const { data, error, isFetching, isLoading } = useQuery({
    enabled: active,
    gcTime: 5 * 60 * 1000,
    queryFn: async ({ signal }) => {
      if (!active || amount === undefined || !normalizedVaultAddress) {
        return { amountOut: 0n };
      }

      const res = await getPtBuyBSLow(
        {
          strategy_id: strategyId!.toString(),
          target_pt_amount: amount.toString(),
          vault_address: normalizedVaultAddress,
        },
        { signal }
      );

      if (!res.finished) throw new Error("PT buy simulation not finished");

      const amountOut = BigInt(res.baseAssetAmount);
      return { amountOut };
    },
    queryKey: qk([
      ROOT,
      version,
      opt(normalizedVaultAddress),
      opt(strategyId?.toString()),
      opt(amount?.toString()),
    ]),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return {
    amountOut: data?.amountOut,
    error: error ?? null,
    isFetching,
    isLoading,
  };
}

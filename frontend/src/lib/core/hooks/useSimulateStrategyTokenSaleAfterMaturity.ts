import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { simulateTokenSale } from "@/lib/api/simulateTokenSale";
import { opt, qk } from "@/lib/query/helpers";
import { QV } from "@/lib/query/versions";

const ROOT = "simulateTokenSale" as const;
const version = QV.simulateTokenSale;

export function useSimulateStrategyTokenSaleAfterMaturity(args: {
  adapters: string[];
  amount: bigint | undefined;
  enabled?: boolean;
}) {
  const { adapters, amount, enabled = true } = args;

  const adapterKey = useMemo(() => adapters.join("|"), [adapters]);
  const active = enabled && !!amount && amount > 0n && adapters.length > 0;

  const { data, error, isFetching, isLoading } = useQuery({
    enabled: active,
    gcTime: 5 * 60 * 1000,
    queryFn: async ({ signal }) => {
      if (!active || !amount) return { amountOut: 0n };

      const res = await simulateTokenSale(
        {
          adapters,
          amount: amount.toString(),
        },
        { signal }
      );

      return { amountOut: BigInt(res.amountOut) };
    },
    queryKey: qk([ROOT, version, opt(adapterKey), opt(amount?.toString())]),
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

import { useQuery } from "@tanstack/react-query";

import { opt, qk } from "@/lib/query/helpers";
import { QV } from "@/lib/query/versions";

import { VaultFullInfo } from "../types";

const ROOT = "strategyReverseRoute" as const;
const version = QV.strategyReverseRoute;

export function useStrategyReverseRoute(args: {
  strategyId: bigint | null | undefined;
  vault: null | undefined | VaultFullInfo;
}) {
  const { strategyId, vault } = args;
  const enabled = !!vault && strategyId !== null && strategyId !== undefined;

  const { data, error, isFetching, isLoading } = useQuery({
    enabled,
    gcTime: 5 * 60 * 1000,
    queryFn: async ({ signal }) => {
      if (!enabled || !vault || strategyId === null || strategyId === undefined) {
        return { adapters: [] as string[] };
      }

      const adapters = await vault.contract.reverseRoute(strategyId, { signal });
      return { adapters: adapters.map(a => a.toString()) };
    },
    queryKey: qk([
      ROOT,
      version,
      opt(vault?.address),
      opt(strategyId?.toString()),
    ]),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return {
    adapters: data?.adapters ?? [],
    error: error ?? null,
    isFetching,
    isLoading,
  };
}

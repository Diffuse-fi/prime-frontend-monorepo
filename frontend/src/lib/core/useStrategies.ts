import { Address } from "viem";
import { useVaultContract } from "./useVaultContract";
import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useQuery } from "@tanstack/react-query";

type UseStrategiesParams = {
  vaultAddressOverride?: Address;
};

const ROOT = "strategies" as const;
const version = QV.strategies;

const vaultKeys = {
  allStrategies: (vault: Address | null) => qk([ROOT, version, opt(vault), "all"]),
};

export function useStrategies({ vaultAddressOverride }: UseStrategiesParams = {}) {
  const vault = useVaultContract(vaultAddressOverride);

  const allStrategies = useQuery({
    enabled: !!vault,
    queryKey: vaultKeys.allStrategies(vaultAddressOverride ?? null),
    queryFn: async () => {
      try {
        const res = await vault!.getStrategies();
        console.log("res", res);
        return res;
      } catch (e) {
        console.error("Error fetching strategies", e);
        throw e;
      }
    },
    staleTime: 30_000,
  });

  return { allStrategies };
}

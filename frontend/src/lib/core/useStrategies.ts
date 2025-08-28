import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useQuery } from "@tanstack/react-query";
import { useVaults } from "./useVaults";

type UseStrategiesParams = {
  //
};

const ROOT = "strategies" as const;
const version = QV.strategies;

const vaultKeys = {
  allStrategies: (address: string | null) => qk([ROOT, version, opt(address), "all"]),
};

export function useStrategies({}: UseStrategiesParams = {}) {
  const vaults = useVaults();
  console.log("useStrategies", vaults);
  const addressesKey = vaults.length > 0 ? vaults.map(v => v.address).join(",") : null;

  const allStrategies = useQuery({
    enabled: vaults.length > 0,
    queryKey: vaultKeys.allStrategies(addressesKey),
    queryFn: async () => {
      const strategies = await Promise.all(
        vaults.map(v =>
          v.vault.getStrategies().then(res => res.map(s => ({ ...s, vault: v })))
        )
      );
      return strategies.flat();
    },
    staleTime: 30_000,
  });

  return { allStrategies };
}

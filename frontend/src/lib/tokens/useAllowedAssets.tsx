import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QV } from "../query/versions";
import { useChainId } from "wagmi";
import { qk } from "../query/helpers";
import { useVaults } from "../core/useVaults";
import { useMemo } from "react";
import { populateTokenListWithMeta } from "./tokensMeta";
import { useTokensMeta } from "./useTokensMeta";

const ROOT = "tokensList" as const;
const version = QV.vault;
const qKeys = {
  allowedTokens: (chainId: number, vaultIds: string) =>
    qk(ROOT, version, "allowed", chainId, vaultIds),
};

export function useAllowedAssets() {
  const chainId = useChainId();
  const vaults = useVaults();
  const vaultsIds = vaults.map(v => v.address).join(",");
  const { meta, isLoading: metaIsLoading } = useTokensMeta(chainId);

  const allowedTokens = useQuery({
    queryKey: qKeys.allowedTokens(chainId, vaultsIds),
    queryFn: async () => {
      const promises = vaults.map(v =>
        v.vault.getAssets().then(assets =>
          assets.map(({ asset, symbol, decimals }) => ({
            chainId,
            address: asset,
            symbol,
            name: symbol,
            decimals,
          }))
        )
      );
      const tokens = (await Promise.all(promises)).flat();
      return tokens;
    },
    enabled: vaults.length > 0,
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  });

  const tokensList = useMemo(() => {
    if (meta && allowedTokens.data) {
      return populateTokenListWithMeta({
        list: allowedTokens.data,
        meta,
      });
    }

    return [];
  }, [meta, allowedTokens.data]);

  const isLoading = metaIsLoading || (allowedTokens.isEnabled && allowedTokens.isLoading);

  return {
    tokensList,
    isLoading,
  };
}

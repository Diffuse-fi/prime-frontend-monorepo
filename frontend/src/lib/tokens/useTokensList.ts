import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { QV } from "../query/versions";
import { useChainId } from "wagmi";
import { apiUrl } from "../api";
import { qk } from "../query/helpers";
import { useVaults } from "../core/useVaults";
import { useCallback, useMemo } from "react";
import { populateTokenListWithMeta } from "./tokensMeta";
import { TokenInfo } from "./validations";

const ROOT = "tokensList" as const;
const version = QV.tokensList;
const qKeys = {
  tokensMetaList: (chainId: number) => qk(ROOT, version, "meta", chainId),
  allowedTokens: (chainId: number, vaultIds: string) =>
    qk(ROOT, version, "allowed", chainId, vaultIds),
};

export function useTokensList() {
  const chainId = useChainId();
  const vaults = useVaults();
  const qc = useQueryClient();
  const vaultsIds = vaults.map(v => v.address).join(",");

  const tokensMetaList = useQuery({
    queryKey: qKeys.tokensMetaList(chainId),
    queryFn: async () => {
      const r = await fetch(apiUrl("tokensMetaList", { chains: [chainId] }));

      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      return r.json() as Promise<TokenInfo[]>;
    },
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  });

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
    if (tokensMetaList.data && allowedTokens.data) {
      return populateTokenListWithMeta({
        list: allowedTokens.data,
        meta: tokensMetaList.data,
      });
    }

    return [];
  }, [tokensMetaList.data, allowedTokens.data]);

  const invalidate = useCallback(
    () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: qKeys.tokensMetaList(chainId) }),
        qc.invalidateQueries({ queryKey: qKeys.allowedTokens(chainId, vaultsIds) }),
      ]),
    [qc, chainId, vaultsIds]
  );

  const isPending =
    tokensMetaList.isPending || (allowedTokens.isEnabled && allowedTokens.isPending);

  const isFetching =
    tokensMetaList.isFetching || (allowedTokens.isEnabled && allowedTokens.isFetching);

  const isRefetching =
    tokensMetaList.isRefetching ||
    (allowedTokens.isEnabled && allowedTokens.isRefetching);

  return {
    tokensList,
    invalidate,
    isPending,
    isFetching,
    isRefetching,
  };
}

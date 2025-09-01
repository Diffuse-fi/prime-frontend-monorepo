import { useMemo } from "react";
import { useClients } from "../wagmi/useClients";
import { useVaultRegistry } from "./useVaultRegistry";
import { Vault } from "@diffuse/sdk-js";
import { VaultFullInfo } from "./types";
import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useTokensMeta } from "../tokens/useTokensMeta";
import { populateTokenListWithMeta } from "../tokens/tokensMeta";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { raceSignal as abortable } from "race-signal";
import pLimit from "p-limit";

const ROOT = "vault" as const;
const version = QV.vault;
const qKeys = {
  strategies: (address: string | null, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "strategies"]),
  assets: (address: string | null, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "assets"]),
};

export function useVaults() {
  const { chainId, publicClient, walletClient } = useClients();
  const { allVaults } = useVaultRegistry();
  const qc = useQueryClient();
  const { meta } = useTokensMeta(chainId);

  const addressKey = useMemo(() => {
    if (!allVaults?.length) return "-";

    const sorted = [...allVaults].map(v => v.vault.toLowerCase()).sort();

    return sorted.join("|");
  }, [allVaults]);

  const vaultContracts = useMemo(() => {
    if (!publicClient || !allVaults?.length || !chainId) return [];

    return allVaults.map(({ vault: vaultAddress, name, targetApr }) => ({
      name,
      address: vaultAddress,
      targetApr,
      contract: new Vault({
        address: vaultAddress,
        chainId,
        client: { public: publicClient, wallet: walletClient },
      }),
    }));
  }, [publicClient, walletClient, chainId, allVaults]);

  const stratLimit = useMemo(() => pLimit(6), []);
  const assetLimit = useMemo(() => pLimit(6), []);

  const enabled = !!chainId && !!publicClient && vaultContracts.length > 0;

  const strategiesQueries = useQuery({
    placeholderData: keepPreviousData,
    enabled,
    queryKey: qKeys.strategies(addressKey, chainId),
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      if (!vaultContracts.length) return [];

      const results = await abortable(
        Promise.all(
          vaultContracts.map(vault =>
            stratLimit(() =>
              vault.contract.getStrategies().then(strs => ({
                vaultAddress: vault.address,
                strategies: strs,
              }))
            )
          )
        ),
        signal
      );

      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      return results.flatMap(({ strategies, vaultAddress }) =>
        strategies.map(s => ({
          apr: s.apr,
          endDate: s.endDate,
          tokenAllocation: s.tokenAllocation,
          vaultAddress,
        }))
      );
    },
    staleTime: 60 * 1000 * 5,
  });

  const rawAssetsQueries = useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryKey: qKeys.assets(addressKey, chainId),
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      if (!vaultContracts.length) return [];

      const results = await abortable(
        Promise.all(
          vaultContracts.map(vault =>
            assetLimit(() =>
              vault.contract.getAssets().then(assets => ({
                vaultAddress: vault.address,
                assets,
              }))
            )
          )
        ),
        signal
      );

      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      return results.flatMap(({ assets, vaultAddress }) =>
        assets.map(({ asset, symbol, decimals }) => ({
          chainId,
          address: asset,
          symbol,
          name: symbol,
          decimals,
          vaultAddress,
        }))
      );
    },
    staleTime: 60 * 1000 * 5,
  });

  const assets = useMemo(() => {
    if (!rawAssetsQueries.data || !meta) return [];

    return populateTokenListWithMeta({
      list: rawAssetsQueries.data,
      meta,
    });
  }, [rawAssetsQueries.data, meta]);

  const strategies = strategiesQueries.data;

  const vaults: VaultFullInfo[] = useMemo(
    () =>
      vaultContracts.map(v => {
        const vaultAssets = assets.filter(a => a.vaultAddress === v.address);
        const vaultStrategies =
          strategies?.filter(s => s.vaultAddress === v.address) ?? [];

        return {
          ...v,
          strategies: vaultStrategies,
          assets: vaultAssets,
        };
      }),
    [vaultContracts, assets, strategies]
  );

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: qKeys.assets(addressKey, chainId) });
    qc.invalidateQueries({ queryKey: qKeys.strategies(addressKey, chainId) });
  };

  const isPending = strategiesQueries.isPending || rawAssetsQueries.isPending;

  return {
    vaults,
    invalidate,
    isPending,
  };
}

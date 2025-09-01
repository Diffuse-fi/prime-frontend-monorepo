import { useMemo } from "react";
import { useClients } from "../wagmi/useClients";
import { useVaultRegistry } from "./useVaultRegistry";
import { Vault } from "@diffuse/sdk-js";
import { VaultFullInfo } from "./types";
import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useTokensMeta } from "../tokens/useTokensMeta";
import { populateTokenListWithMeta } from "../tokens/tokensMeta";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ROOT = "vault" as const;
const version = QV.vault;
const qKeys = {
  strategies: (address: string | null) => qk([ROOT, version, opt(address), "strategies"]),
  assets: (address: string | null) => qk([ROOT, version, opt(address), "assets"]),
};

export function useVaults() {
  const { chainId, publicClient, walletClient } = useClients();
  const { allVaults } = useVaultRegistry();
  const qc = useQueryClient();
  const { meta } = useTokensMeta(chainId);
  const addressKey = allVaults?.map(v => v.vault.toLowerCase()).join("-") ?? "-";

  const vaultContracts = useMemo(() => {
    if (!publicClient || !allVaults) return [];

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

  const strategiesQueries = useQuery({
    enabled: vaultContracts.length > 0,
    queryKey: qKeys.strategies(addressKey),
    queryFn: async () => {
      if (!vaultContracts) return [];

      const results = await Promise.all(
        vaultContracts.map(async vault => {
          const strs = await vault.contract.getStrategies();

          return {
            vaultAddress: vault.address,
            strategies: strs,
          };
        })
      );

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
    enabled: vaultContracts.length > 0,
    queryKey: qKeys.assets(addressKey),
    queryFn: async () => {
      if (!vaultContracts) return [];

      const results = await Promise.all(
        vaultContracts.map(async vault => {
          const vaultAssets = await vault.contract.getAssets();

          return {
            vaultAddress: vault.address,
            assets: vaultAssets,
          };
        })
      );

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

  const vaults: VaultFullInfo[] = vaultContracts.map(v => {
    const vaultAssets = assets.filter(a => a.vaultAddress === v.address);
    const vaultStrategies = strategies?.filter(s => s.vaultAddress === v.address) ?? [];

    return {
      ...v,
      strategies: vaultStrategies,
      assets: vaultAssets,
    };
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: qKeys.assets(addressKey) });
    qc.invalidateQueries({ queryKey: qKeys.strategies(addressKey) });
  };

  const isLoading = strategiesQueries.isLoading || rawAssetsQueries.isLoading;
  const isPending = strategiesQueries.isPending || rawAssetsQueries.isPending;

  return {
    vaults,
    invalidate,
    isLoading,
    isPending,
  };
}

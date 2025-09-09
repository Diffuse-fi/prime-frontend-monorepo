import { useMemo } from "react";
import { useClients } from "../wagmi/useClients";
import { useVaultRegistry } from "./useVaultRegistry";
import { Vault } from "@diffuse/sdk-js";
import { VaultFullInfo } from "./types";
import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useAssetsMeta } from "../assets/useAssetsMeta";
import { populateAssetListWithMeta } from "../assets/assetsMeta";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import pLimit from "p-limit";
import { Address, getAddress } from "viem";
import uniqBy from "lodash/uniqBy";
import { AssetInfo } from "../assets/validations";

export type UseVaultsResult = {
  vaults: VaultFullInfo[];
  invalidate: () => void;
  isPending: boolean;
  isLoading: boolean;
  vaultsAssetsList: AssetInfo[];
};

const STRATEGY_LIMIT = pLimit(6);
const ASSET_LIMIT = pLimit(6);
const VAULT_LIMITS_LIMIT = pLimit(3);

const ROOT = "vault" as const;
const version = QV.vault;
const qKeys = {
  strategies: (address: string | null, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "strategies"]),
  assets: (address: string | null, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "assets"]),
  limits: (addresses: string | null, chainId: number, owner: Address | undefined) =>
    qk([
      ROOT,
      version,
      opt(addresses),
      chainId,
      opt(owner),
      "limits",
    ]),
};

export function useVaults(): UseVaultsResult {
  const { chainId, publicClient, walletClient, address: owner } = useClients();
  const { allVaults } = useVaultRegistry();
  const qc = useQueryClient();
  const { meta, isLoading: assetsMetaLoading } = useAssetsMeta(chainId);

  const addressKey = useMemo(() => {
    if (!allVaults?.length) return null;

    const sorted = [...allVaults].map(v => v.vault.toLowerCase()).sort();

    return sorted.join("|");
  }, [allVaults]);

  const vaultContracts = useMemo(() => {
    if (!publicClient || !allVaults?.length || !chainId) return [];

    return allVaults.map(({ vault: vaultAddress, name, targetApr }) => {
      const address = getAddress(vaultAddress);

      return {
        name,
        address,
        targetApr,
        contract: new Vault({
          address,
          chainId,
          client: { public: publicClient, wallet: walletClient },
        }),
      };
    });
  }, [publicClient, walletClient, chainId, allVaults]);

  const enabled =
    !!chainId && !!publicClient && !!addressKey && vaultContracts.length > 0;

  const strategiesQueries = useQuery({
    enabled,
    queryKey: qKeys.strategies(addressKey, chainId),
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      if (!vaultContracts.length) return [];

      const results = await Promise.all(
        vaultContracts.map(vault =>
          STRATEGY_LIMIT(() =>
            vault.contract.getStrategies({ signal }).then(strs => ({
              vaultAddress: vault.address,
              strategies: strs,
            }))
          )
        )
      );

      return results.flatMap(({ strategies, vaultAddress }) =>
        strategies.map(s => ({
          apr: s.apr,
          endDate: s.endDate,
          balance: s.balance,
          vaultAddress,
        }))
      );
    },
    staleTime: 60 * 1000 * 5,
  });

  const limitsQueries = useQuery({
    enabled: enabled && !!owner,
    queryKey: qKeys.limits(addressKey, chainId, owner),
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      if (!vaultContracts.length) return [];

      const results = await Promise.all(
        vaultContracts.flatMap(v => [
          VAULT_LIMITS_LIMIT(() =>
            v.contract
              .getMaxDeposit(owner!, { signal })
              .then(maxDeposit => ({ v: v.address, maxDeposit }))
          ),
          VAULT_LIMITS_LIMIT(() =>
            v.contract
              .getMaxWithdraw(owner!, { signal })
              .then(maxWithdraw => ({ v: v.address, maxWithdraw }))
          ),
        ])
      );

      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      const limitsMap = new Map<Address, { maxDeposit: bigint; maxWithdraw: bigint }>();

      for (const r of results) {
        const prev = limitsMap.get(r.v) ?? { maxDeposit: 0n, maxWithdraw: 0n };
        if ("maxDeposit" in r) prev.maxDeposit = r.maxDeposit;
        if ("maxWithdraw" in r) prev.maxWithdraw = r.maxWithdraw;

        limitsMap.set(r.v, prev);
      }

      return Array.from(limitsMap, ([vaultAddress, { maxDeposit, maxWithdraw }]) => ({
        vaultAddress,
        maxDeposit,
        maxWithdraw,
      }));
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });

  const rawAssetsQueries = useQuery({
    enabled,
    queryKey: qKeys.assets(addressKey, chainId),
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      if (!vaultContracts.length) return [];

      const results = await Promise.all(
        vaultContracts.map(vault =>
          ASSET_LIMIT(() =>
            vault.contract.getAssets({ signal }).then(assets => ({
              vaultAddress: vault.address,
              assets,
            }))
          )
        )
      );

      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      return results.flatMap(({ assets, vaultAddress }) =>
        assets.map(({ asset, symbol, decimals }) => ({
          chainId,
          address: getAddress(asset),
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

    return populateAssetListWithMeta({
      list: rawAssetsQueries.data,
      meta,
    });
  }, [rawAssetsQueries.data, meta]);

  const limits = limitsQueries.data;

  const strategiesByVault = useMemo(() => {
    const m = new Map<Address, typeof strategiesQueries.data>();

    strategiesQueries.data?.forEach(s => {
      const k = s.vaultAddress;
      const arr = m.get(k);
      if (arr) arr.push(s);
      else m.set(k, [s]);
    });

    return m;
  }, [strategiesQueries]);

  const assetsByVault = useMemo(() => {
    const m = new Map<Address, ReturnType<typeof populateAssetListWithMeta>>();

    assets.forEach(a => {
      const k = a.vaultAddress;
      const arr = m.get(k);
      if (arr) arr.push(a);
      else m.set(k, [a]);
    });

    return m;
  }, [assets]);

  const limitsByVault = useMemo(() => {
    const m = new Map<Address, { maxDeposit?: bigint; maxWithdraw?: bigint }>();

    limits?.forEach(l => m.set(l.vaultAddress, l));

    return m;
  }, [limits]);

  const vaults: VaultFullInfo[] = useMemo(() => {
    if (assetsMetaLoading) return [];

    return vaultContracts.map(v => ({
      ...v,
      strategies: strategiesByVault.get(v.address) ?? [],
      assets: assetsByVault.get(v.address) ?? [],
      limits: {
        maxDeposit: limitsByVault.get(v.address)?.maxDeposit,
        maxWithdraw: limitsByVault.get(v.address)?.maxWithdraw,
      },
    }));
  }, [
    vaultContracts,
    strategiesByVault,
    assetsByVault,
    limitsByVault,
    assetsMetaLoading,
  ]);

  const vaultsAssetsList = useMemo(
    () =>
      uniqBy(
        vaults.flatMap(v => v.assets ?? []),
        t => t.address
      ),
    [vaults]
  );

  const invalidate = () => {
    if (!chainId || !addressKey) return;

    const promises = [
      qc.invalidateQueries({ queryKey: qKeys.assets(addressKey, chainId) }),
      qc.invalidateQueries({ queryKey: qKeys.strategies(addressKey, chainId) }),
      qc.invalidateQueries({ queryKey: qKeys.limits(addressKey, chainId, owner) }),
    ];

    return Promise.all(promises);
  };

  const isPending = strategiesQueries.isPending || rawAssetsQueries.isPending;
  const isLoading = strategiesQueries.isLoading || rawAssetsQueries.isLoading;

  return {
    vaults,
    invalidate,
    isPending,
    isLoading,
    vaultsAssetsList,
  };
}

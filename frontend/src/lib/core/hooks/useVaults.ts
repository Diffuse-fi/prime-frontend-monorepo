import { Vault } from "@diffuse/sdk-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import uniqBy from "lodash/uniqBy";
import pLimit from "p-limit";
import { useMemo } from "react";
import { Address, getAddress } from "viem";
import { usePublicClient } from "wagmi";

import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { VaultFullInfo, VaultLimits } from "../types";
import { useViewer } from "./useViewer";

const ASSET_LIMIT = pLimit(6);
const VAULT_LIMITS_LIMIT = pLimit(3);
const AVAILABLE_LIQUIDITY_LIMIT = pLimit(6);
const CURATORS_LIMIT = pLimit(6);

const ROOT = "vault" as const;
const version = QV.vault;
const qKeys = {
  curators: (address: null | string, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "curators"]),
  limits: (addresses: null | string, chainId: number, owner: Address | undefined) =>
    qk([
      ROOT,
      version,
      opt(addresses),
      chainId,
      opt(owner),
      "limits",
    ]),
  liquidity: (address: null | string, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "availableLiquidity"]),
  totalAssets: (address: null | string, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "totalAssets"]),
};

export function useVaults() {
  const { chainId } = useReadonlyChain();
  const publicClient = usePublicClient({ chainId });
  const { address: owner, walletClient } = useClients();
  const { allVaults, isLoading, isPending, refetch } = useViewer({
    chainId,
    filterOutOutdatedStrategies: true,
  });
  const qc = useQueryClient();

  const addressKey = useMemo(() => {
    if (!allVaults?.length) return null;

    const sorted = [...allVaults].map(v => v.vault.toLowerCase()).sort();

    return sorted.join("|");
  }, [allVaults]);

  const vaultContracts = useMemo(() => {
    if (!publicClient || !allVaults?.length || !chainId) return [];

    return allVaults.map(
      ({
        assets,
        feeData,
        name,
        riskLevel,
        strategies,
        targetApr,
        vault: vaultAddress,
      }) => {
        const address = getAddress(vaultAddress);

        return {
          address,
          assets,
          contract: new Vault({
            address,
            chainId,
            client: { public: publicClient, wallet: walletClient },
          }),
          feeData,
          name,
          riskLevel,
          strategies,
          targetApr,
        };
      }
    );
  }, [publicClient, chainId, allVaults, walletClient]);

  const enabled =
    !!chainId && !!publicClient && !!addressKey && vaultContracts.length > 0;

  const limitsQueries = useQuery({
    enabled: enabled && !!owner,
    gcTime: 1000 * 60 * 60 * 2,
    queryFn: async ({ signal }) => {
      if (vaultContracts.length === 0) return [];

      const results = await Promise.all(
        vaultContracts.flatMap(v => [
          VAULT_LIMITS_LIMIT(() =>
            v.contract
              .getMaxDeposit(owner!, { signal })
              .then(maxDeposit => ({ maxDeposit, v: v.address }))
          ),
          VAULT_LIMITS_LIMIT(() =>
            v.contract
              .getMaxWithdraw(owner!, { signal })
              .then(maxWithdraw => ({ maxWithdraw, v: v.address }))
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
        maxDeposit,
        maxWithdraw,
        vaultAddress,
      }));
    },
    queryKey: qKeys.limits(addressKey, chainId, owner),
    staleTime: 1000 * 60 * 60,
  });

  const rawTotalAssetQueries = useQuery({
    enabled,
    queryFn: async ({ signal }) => {
      if (vaultContracts.length === 0) return [];

      const results = await Promise.all(
        vaultContracts.map(vault =>
          ASSET_LIMIT(() =>
            vault.contract.totalAssets({ signal }).then(totalAssets => ({
              totalAssets,
              vaultAddress: vault.address,
            }))
          )
        )
      );

      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      return results;
    },
    queryKey: qKeys.totalAssets(addressKey, chainId),
    staleTime: 60 * 1000 * 5,
  });

  const availableLiquidityQuery = useQuery({
    enabled,
    gcTime: 10 * 60_000,
    queryFn: async () => {
      if (vaultContracts.length === 0) return [];

      const promises = vaultContracts.map(v =>
        AVAILABLE_LIQUIDITY_LIMIT(() =>
          v.contract.getAvailableLiquidity().then(liquidity => ({
            liquidity,
            vaultAddress: v.address,
          }))
        )
      );
      const liquidities = await Promise.all(promises);

      return liquidities;
    },
    queryKey: qKeys.liquidity(addressKey, chainId),
    staleTime: 30_000,
  });

  const curatorsQuery = useQuery({
    enabled,
    gcTime: 2 * 60 * 60 * 1000,
    queryFn: async () => {
      if (vaultContracts.length === 0) return [];

      const promises = vaultContracts.map(v =>
        CURATORS_LIMIT(() =>
          v.contract.getCurator().then(curator => ({
            curator: getAddress(curator),
            vaultAddress: v.address,
          }))
        )
      );
      const curators = await Promise.all(promises);

      return curators;
    },
    queryKey: qKeys.curators(addressKey, chainId),
    staleTime: 60 * 60 * 1000,
  });

  const totalAssetsByVault = useMemo(() => {
    const m = new Map<Address, bigint>();

    if (rawTotalAssetQueries.data)
      for (const { totalAssets, vaultAddress } of rawTotalAssetQueries.data) {
        m.set(vaultAddress, totalAssets);
      }

    return m;
  }, [rawTotalAssetQueries.data]);

  const limits = limitsQueries.data;

  const limitsByVault = useMemo(() => {
    const m = new Map<Address, { maxDeposit?: bigint; maxWithdraw?: bigint }>();

    if (limits) for (const l of limits) m.set(l.vaultAddress, l);

    return m;
  }, [limits]);

  const availableLiquidityByVault = useMemo(() => {
    const m = new Map<Address, bigint>();

    if (availableLiquidityQuery.data)
      for (const { liquidity, vaultAddress } of availableLiquidityQuery.data) {
        m.set(vaultAddress, liquidity);
      }

    return m;
  }, [availableLiquidityQuery.data]);

  const curatorsByVault = useMemo(() => {
    const m = new Map<Address, Address>();

    if (curatorsQuery.data)
      for (const { curator, vaultAddress } of curatorsQuery.data) {
        m.set(vaultAddress, curator);
      }

    return m;
  }, [curatorsQuery.data]);

  const vaults: VaultFullInfo[] = useMemo(() => {
    if (!chainId) return [];

    if (vaultContracts.length === 0) return [];

    if (rawTotalAssetQueries.isPending) return [];
    if (rawTotalAssetQueries.isError) return [];

    if (availableLiquidityQuery.isPending) return [];
    if (availableLiquidityQuery.isError) return [];

    if (curatorsQuery.isPending) return [];
    if (curatorsQuery.isError) return [];

    if (totalAssetsByVault.size === 0) return [];
    if (availableLiquidityByVault.size === 0) return [];
    if (curatorsByVault.size === 0) return [];

    return vaultContracts.map(v => ({
      ...v,
      availableLiquidity: availableLiquidityByVault.get(v.address) ?? 0n,
      curator: curatorsByVault.get(v.address),
      totalAssets: totalAssetsByVault.get(v.address),
    }));
  }, [
    vaultContracts,
    totalAssetsByVault,
    rawTotalAssetQueries.isPending,
    rawTotalAssetQueries.isError,
    availableLiquidityByVault,
    availableLiquidityQuery.isPending,
    availableLiquidityQuery.isError,
    chainId,
    curatorsByVault,
    curatorsQuery.isPending,
    curatorsQuery.isError,
  ]);

  const vaultsAssetsList = useMemo(
    () =>
      uniqBy(
        vaults.flatMap(v => v.assets ?? []),
        t => t.address
      ),
    [vaults]
  );

  const vaultLimits = useMemo(() => {
    const limits: VaultLimits[] = [];
    for (const v of vaults) {
      const l = limitsByVault.get(v.address);
      if (l) {
        limits.push({
          address: v.address,
          chainId,
          maxDeposit: l.maxDeposit,
          maxWithdraw: l.maxWithdraw,
        });
      }
    }
    return uniqBy(limits, l => `${l.chainId}-${l.address}`);
  }, [chainId, vaults, limitsByVault]);

  const invalidate = () => {
    if (!chainId || !addressKey) return;

    const promises = [
      qc.invalidateQueries({ queryKey: qKeys.limits(addressKey, chainId, owner) }),
    ];

    return Promise.all(promises);
  };

  return {
    invalidate,
    isLoading,
    isPending,
    refetch: () => {
      refetch();
      availableLiquidityQuery.refetch();
    },
    refetchLimits: () =>
      qc.refetchQueries({ queryKey: qKeys.limits(addressKey, chainId, owner) }),
    refetchTotalAssets: () =>
      qc.refetchQueries({ queryKey: qKeys.totalAssets(addressKey, chainId) }),
    vaultLimits,
    vaults,
    vaultsAssetsList,
  };
}

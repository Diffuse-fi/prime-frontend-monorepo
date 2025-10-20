import { useMemo } from "react";
import { useClients } from "../../wagmi/useClients";
import { useViewer } from "./useViewer";
import { Vault } from "@diffuse/sdk-js";
import { VaultFullInfo, VaultLimits } from "../types";
import { QV } from "../../query/versions";
import { opt, qk } from "../../query/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import pLimit from "p-limit";
import { Address, getAddress } from "viem";
import uniqBy from "lodash/uniqBy";
import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";
import { usePublicClient } from "wagmi";

const ASSET_LIMIT = pLimit(6);
const VAULT_LIMITS_LIMIT = pLimit(3);
const AVAILABLE_LIQUIDITY_LIMIT = pLimit(6);

const ROOT = "vault" as const;
const version = QV.vault;
const qKeys = {
  totalAssets: (address: string | null, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "totalAssets"]),
  limits: (addresses: string | null, chainId: number, owner: Address | undefined) =>
    qk([
      ROOT,
      version,
      opt(addresses),
      chainId,
      opt(owner),
      "limits",
    ]),
  liquidity: (address: string | null, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "availableLiquidity"]),
};

export function useVaults() {
  const { chainId } = useReadonlyChain();
  const publicClient = usePublicClient({ chainId });
  const { address: owner, walletClient } = useClients();
  const { allVaults, isLoading, isPending, refetch } = useViewer({ chainId });
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
        vault: vaultAddress,
        name,
        targetApr,
        riskLevel,
        strategies,
        assets,
        feeData,
      }) => {
        const address = getAddress(vaultAddress);

        return {
          name,
          address,
          targetApr,
          riskLevel,
          strategies,
          assets,
          feeData,
          contract: new Vault({
            address,
            chainId,
            client: { public: publicClient, wallet: walletClient },
          }),
        };
      }
    );
  }, [publicClient, chainId, allVaults, walletClient]);

  const enabled =
    !!chainId && !!publicClient && !!addressKey && vaultContracts.length > 0;

  const limitsQueries = useQuery({
    enabled: enabled && !!owner,
    queryKey: qKeys.limits(addressKey, chainId, owner),
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

  const rawTotalAssetQueries = useQuery({
    enabled,
    queryKey: qKeys.totalAssets(addressKey, chainId),
    queryFn: async ({ signal }) => {
      if (!vaultContracts.length) return [];

      const results = await Promise.all(
        vaultContracts.map(vault =>
          ASSET_LIMIT(() =>
            vault.contract.totalAssets({ signal }).then(totalAssets => ({
              vaultAddress: vault.address,
              totalAssets,
            }))
          )
        )
      );

      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      return results;
    },
    staleTime: 60 * 1000 * 5,
  });

  const availableLiquidityQuery = useQuery({
    enabled,
    queryKey: qKeys.liquidity(addressKey, chainId),
    queryFn: async () => {
      if (!vaultContracts.length) return [];

      const promises = vaultContracts.map(v =>
        AVAILABLE_LIQUIDITY_LIMIT(() =>
          v.contract.getAvailableLiquidity().then(liquidity => ({
            vaultAddress: v.address,
            liquidity,
          }))
        )
      );
      const liquidities = await Promise.all(promises);

      return liquidities;
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
  });

  const totalAssetsByVault = useMemo(() => {
    const m = new Map<Address, bigint>();

    rawTotalAssetQueries.data?.forEach(({ vaultAddress, totalAssets }) => {
      m.set(vaultAddress, totalAssets);
    });

    return m;
  }, [rawTotalAssetQueries.data]);

  const limits = limitsQueries.data;

  const limitsByVault = useMemo(() => {
    const m = new Map<Address, { maxDeposit?: bigint; maxWithdraw?: bigint }>();

    limits?.forEach(l => m.set(l.vaultAddress, l));

    return m;
  }, [limits]);

  const availableLiquidityByVault = useMemo(() => {
    const m = new Map<Address, bigint>();

    availableLiquidityQuery.data?.forEach(({ vaultAddress, liquidity }) => {
      m.set(vaultAddress, liquidity);
    });

    return m;
  }, [availableLiquidityQuery.data]);

  const vaults: VaultFullInfo[] = useMemo(() => {
    if (!chainId) return [];

    if (!vaultContracts.length) return [];
    if (rawTotalAssetQueries.isPending) return [];

    if (rawTotalAssetQueries.isError) return [];

    if (!totalAssetsByVault.size) return [];
    if (!availableLiquidityByVault.size) return [];

    if (availableLiquidityQuery.isPending) return [];
    if (availableLiquidityQuery.isError) return [];

    return vaultContracts.map(v => ({
      ...v,
      totalAssets: totalAssetsByVault.get(v.address),
      availableLiquidity: availableLiquidityByVault.get(v.address) ?? 0n,
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
    vaults,
    invalidate,
    isPending,
    vaultLimits,
    isLoading,
    vaultsAssetsList,
    refetch,
    refetchTotalAssets: () =>
      qc.refetchQueries({ queryKey: qKeys.totalAssets(addressKey, chainId) }),
    refetchLimits: () =>
      qc.refetchQueries({ queryKey: qKeys.limits(addressKey, chainId, owner) }),
  };
}

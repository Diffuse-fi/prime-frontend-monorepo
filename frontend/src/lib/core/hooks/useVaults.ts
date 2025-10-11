import { useMemo } from "react";
import { useClients } from "../../wagmi/useClients";
import { useViewer } from "./useViewer";
import { Vault } from "@diffuse/sdk-js";
import { VaultFullInfo } from "../types";
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
const SPREAD_FEE_LIMIT = pLimit(6);

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
  spreadFee: (address: string | null, chainId: number) =>
    qk([ROOT, version, opt(address), chainId, "spreadFee"]),
};

export function useVaults() {
  const { chainId } = useReadonlyChain();
  const publicClient = usePublicClient({ chainId });
  const { address: owner, walletClient } = useClients();
  const { allVaults, isLoading, isPending } = useViewer({ chainId });
  const qc = useQueryClient();

  const addressKey = useMemo(() => {
    if (!allVaults?.length) return null;

    const sorted = [...allVaults].map(v => v.vault.toLowerCase()).sort();

    return sorted.join("|");
  }, [allVaults]);

  const vaultContracts = useMemo(() => {
    if (!publicClient || !allVaults?.length || !chainId) return [];

    return allVaults.map(
      ({ vault: vaultAddress, name, targetApr, riskLevel, strategies, assets }) => {
        const address = getAddress(vaultAddress);

        return {
          name,
          address,
          targetApr,
          riskLevel,
          strategies,
          assets,
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

  const spreadFeeQuery = useQuery({
    enabled,
    queryKey: qKeys.spreadFee(addressKey, chainId),
    queryFn: async () => {
      if (!vaultContracts.length) return [];

      const promises = vaultContracts.map(v =>
        SPREAD_FEE_LIMIT(() =>
          v.contract.getSpreadFee().then(fee => ({
            vaultAddress: v.address,
            fee,
          }))
        )
      );
      const fees = await Promise.all(promises);

      return fees;
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

  const spreadFeeByVault = useMemo(() => {
    const m = new Map<Address, number>();

    spreadFeeQuery.data?.forEach(({ vaultAddress, fee }) => {
      m.set(vaultAddress, fee);
    });

    return m;
  }, [spreadFeeQuery.data]);

  const vaults: VaultFullInfo[] = useMemo(() => {
    if (!vaultContracts.length) return [];
    if (rawTotalAssetQueries.isPending) return [];
    if (limitsQueries.isPending) return [];
    if (!limitsByVault.size) return [];

    if (limitsQueries.isError) return [];
    if (rawTotalAssetQueries.isError) return [];

    if (!totalAssetsByVault.size) return [];

    if (spreadFeeQuery.isPending) return [];
    if (spreadFeeQuery.isError) return [];

    return vaultContracts.map(v => ({
      ...v,
      limits: {
        maxDeposit: limitsByVault.get(v.address)?.maxDeposit,
        maxWithdraw: limitsByVault.get(v.address)?.maxWithdraw,
      },
      totalAssets: totalAssetsByVault.get(v.address),
      spreadFee: spreadFeeByVault.get(v.address) ?? 0,
    }));
  }, [
    vaultContracts,
    limitsByVault,
    totalAssetsByVault,
    rawTotalAssetQueries.isPending,
    limitsQueries.isPending,
    rawTotalAssetQueries.isError,
    limitsQueries.isError,
    spreadFeeQuery.isPending,
    spreadFeeQuery.isError,
    spreadFeeByVault,
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
      qc.invalidateQueries({ queryKey: qKeys.limits(addressKey, chainId, owner) }),
    ];

    return Promise.all(promises);
  };

  return {
    vaults,
    invalidate,
    isPending,
    isLoading,
    vaultsAssetsList,
    refetchTotalAssets: () =>
      qc.refetchQueries({ queryKey: qKeys.totalAssets(addressKey, chainId) }),
    refetchLimits: () =>
      qc.refetchQueries({ queryKey: qKeys.limits(addressKey, chainId, owner) }),
  };
}

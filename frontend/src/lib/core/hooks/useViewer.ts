"use client";

import { QV } from "../../query/versions";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { opt, qk } from "../../query/helpers";
import { Address, getAddress } from "viem";
import { usePublicClient } from "wagmi";
import { useMemo } from "react";
import { Viewer } from "@diffuse/sdk-js";
import pLimit from "p-limit";
import { useAssetsMeta } from "@/lib/assets/useAssetsMeta";
import { populateAssetListWithMeta } from "@/lib/assets/assetsMeta";
import { VaultRiskLevel } from "../types";

type UseViewerParams = {
  addressOverride?: Address;
  chainId: number;
};

const ROOT = "viewer";
const version = QV.viewerData;

export const viewerQK = {
  allVaults: (normalizedAddr: Address | null, chainId: number) =>
    qk([ROOT, version, opt(normalizedAddr), chainId]),
};

const limit = pLimit(6);

export function viewerAllVaultsQuery(
  viewer: Viewer,
  normalizedAddress: Address | null,
  chainId: number
) {
  return queryOptions({
    queryKey: viewerQK.allVaults(normalizedAddress, chainId),
    queryFn: async ({ signal }) => {
      const vaults = await viewer.getVaults({ signal });

      const assetsPromises = vaults.map(v => viewer.getAssets(v.vault, { signal }));
      const strategiesPromises = vaults.map(v =>
        viewer.getStrategies(v.vault, { signal })
      );

      const assets = await Promise.all(assetsPromises.map(p => limit(() => p)));
      const strategies = await Promise.all(strategiesPromises.map(p => limit(() => p)));

      return vaults.map((v, i) => ({
        ...v,
        assets: assets[i],
        strategies: strategies[i],
      }));
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useViewer({ addressOverride, chainId }: UseViewerParams) {
  const normalizedAddress = addressOverride ? getAddress(addressOverride) : null;
  const publicClient = usePublicClient({ chainId });
  const { meta } = useAssetsMeta(chainId);

  const viewer = useMemo(() => {
    if (!publicClient) return null;
    return new Viewer({
      client: { public: publicClient },
      chainId,
      address: normalizedAddress ?? undefined,
    });
  }, [publicClient, chainId, normalizedAddress]);

  const query = useQuery({
    ...viewerAllVaultsQuery(viewer as Viewer, normalizedAddress, chainId),
    enabled: !!viewer && !!chainId,
  });

  const allVaults = useMemo(() => {
    if (!query.data) return [];
    if (!meta) return [];

    return query.data.map(v => ({
      ...v,
      riskLevel: v.riskLevel as VaultRiskLevel,
      assets: populateAssetListWithMeta({
        list: v.assets.map(a => ({
          ...a,
          address: getAddress(a.asset),
          chainId: chainId,
          name: a.symbol,
        })),
        meta,
      }),
    }));
  }, [query.data, meta, chainId]);

  return {
    allVaults,
    isPending: query.isPending,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

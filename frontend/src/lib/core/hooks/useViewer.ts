"use client";

import { Viewer } from "@diffuse/sdk-js";
import { queryOptions, useQuery } from "@tanstack/react-query";
import pLimit from "p-limit";
import { useMemo } from "react";
import { Address, getAddress } from "viem";
import { usePublicClient } from "wagmi";

import {
  populateAssetListWithMeta,
  populateAssetWithMeta,
} from "@/lib/assets/assetsMeta";
import { getContractAddressOverride } from "@/lib/wagmi/getContractAddressOverride";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { VaultRiskLevel } from "../types";

type UseViewerParams = {
  chainId: number;
};

const ROOT = "viewer";
const version = QV.viewerData;

export const viewerQK = {
  allVaults: (normalizedAddr: Address | null, chainId: number) =>
    qk([ROOT, version, opt(normalizedAddr), chainId]),
};

const limit = pLimit(6);

export function useViewer({ chainId }: UseViewerParams) {
  const addressOverride = getContractAddressOverride(chainId, "Viewer");
  const normalizedAddress = addressOverride ? getAddress(addressOverride) : null;
  const publicClient = usePublicClient({ chainId });

  const viewer = useMemo(() => {
    if (!publicClient) return null;
    return new Viewer({
      address: normalizedAddress ?? undefined,
      chainId,
      client: { public: publicClient },
    });
  }, [publicClient, chainId, normalizedAddress]);

  const query = useQuery({
    ...viewerAllVaultsQuery(viewer as Viewer, normalizedAddress, chainId),
    enabled: !!viewer && !!chainId,
  });

  const allVaults = useMemo(() => {
    if (!query.data) return [];

    return query.data.map(v => ({
      ...v,
      assets: populateAssetListWithMeta(
        v.assets.map(a => ({
          ...a,
          address: getAddress(a.asset),
          chainId: chainId,
          name: a.symbol,
        }))
      ),
      riskLevel: v.riskLevel as VaultRiskLevel,
      strategies: v.strategies.map(s => ({
        ...s,
        token: populateAssetWithMeta({
          address: getAddress(s.token.asset),
          chainId: chainId,
          decimals: s.token.decimals,
          name: s.token.symbol,
          symbol: s.token.symbol,
        }),
      })),
    }));
  }, [query.data, chainId]);

  return {
    allVaults,
    error: query.error,
    isLoading: query.isLoading,
    isPending: query.isPending,
    refetch: query.refetch,
  };
}

export function viewerAllVaultsQuery(
  viewer: Viewer,
  normalizedAddress: Address | null,
  chainId: number
) {
  return queryOptions({
    gcTime: 24 * 60 * 60 * 1000,
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
    queryKey: viewerQK.allVaults(normalizedAddress, chainId),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });
}

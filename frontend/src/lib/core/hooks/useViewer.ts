"use client";

import { Viewer } from "@diffuse/sdk-js";
import { queryOptions, useQuery } from "@tanstack/react-query";
import pLimit from "p-limit";
import { useMemo } from "react";
import { Address, getAddress } from "viem";
import { usePublicClient } from "wagmi";

import { env } from "@/env";
import {
  populateAssetListWithMeta,
  populateAssetWithMeta,
} from "@/lib/assets/assetsMeta";
import { isPast } from "@/lib/formatters/date";
import { getContractAddressOverride } from "@/lib/wagmi/getContractAddressOverride";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { VaultRiskLevel } from "../types";

type UseViewerParams = {
  chainId: number;
  filterOutOutadtedStrategies?: boolean;
};

const ROOT = "viewer";
const version = QV.viewerData;

export const viewerQK = {
  allVaults: (normalizedAddr: Address | null, chainId: number) =>
    qk([ROOT, version, opt(normalizedAddr), chainId]),
};

const limit = pLimit(6);

export function useViewer({ chainId, filterOutOutadtedStrategies }: UseViewerParams) {
  const addressOverride =
    getContractAddressOverride(chainId, "Viewer", env.NEXT_PUBLIC_ADDRESSES_OVERRIDES) ??
    null;
  const publicClient = usePublicClient({ chainId });

  const viewer = useMemo(() => {
    if (!publicClient) return null;
    return new Viewer({
      address: addressOverride ?? undefined,
      chainId,
      client: { public: publicClient },
    });
  }, [publicClient, chainId, addressOverride]);

  const query = useQuery({
    ...viewerAllVaultsQuery(viewer as Viewer, addressOverride, chainId),
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
      strategies: v.strategies
        .filter(s => {
          if (!filterOutOutadtedStrategies) return true;
          return !isPast(s.endDate);
        })
        .map(s => ({
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
  }, [query.data, chainId, filterOutOutadtedStrategies]);

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

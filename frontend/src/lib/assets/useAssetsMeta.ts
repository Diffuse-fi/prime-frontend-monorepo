import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../api";
import { QV } from "../query/versions";
import { AssetInfo } from "./validations";

const ROOT = "assetsMeta" as const;
const version = QV.assetsMeta;
const qk = {
  assetsMeta: (chainId: number) => [ROOT, version, chainId] as const,
};

export function useAssetsMeta(chainId: number) {
  const res = useQuery<AssetInfo[]>({
    queryKey: qk.assetsMeta(chainId),
    queryFn: async ({ signal }) => {
      const r = await fetch(apiUrl("assetMetaList", { chains: [chainId] }), { signal });
      return await (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 2,
  });

  return {
    meta: res.data,
    isLoading: res.isLoading,
    error: res.error,
  };
}

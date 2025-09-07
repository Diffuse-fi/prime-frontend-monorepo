import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../api";
import { QV } from "../query/versions";
import { TokenInfo } from "./validations";

const ROOT = "meta" as const;
const version = QV.tokensMeta;
const qk = {
  tokensMeta: (chainId: number) => [ROOT, version, "tokensMeta", chainId] as const,
};

export function useTokensMeta(chainId: number) {
  const res = useQuery<TokenInfo[]>({
    queryKey: qk.tokensMeta(chainId),
    queryFn: async ({ signal }) => {
      const r = await fetch(apiUrl("tokensMetaList", { chains: [chainId] }), { signal });
      return await (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
    },
    staleTime: 1000 * 60 * 60,
  });

  return {
    meta: res.data,
    isLoading: res.isLoading,
    error: res.error,
  };
}

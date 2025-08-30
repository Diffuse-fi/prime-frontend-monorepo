import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiUrl } from "../api";
import { QV } from "../query/versions";
import { TokenInfo } from "./validations";

const ROOT = "meta" as const;
const version = QV.tokensMeta;
const qk = {
  tokensMeta: (chainId: number) => [ROOT, version, "tokensMeta", chainId] as const,
};

async function fetchTokensMeta(chainId: number): Promise<TokenInfo[]> {
  const r = await fetch(apiUrl("tokensMetaList", { chains: [chainId] }));
  return await (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
}

export function useTokensMeta(chainId: number) {
  const res = useQuery({
    queryKey: qk.tokensMeta(chainId),
    queryFn: () => fetchTokensMeta(chainId),
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  });

  return {
    meta: res.data,
    isLoading: res.isLoading,
    error: res.error,
  };
}

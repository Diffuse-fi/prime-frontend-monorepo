import { useQuery } from "@tanstack/react-query";
import { QV } from "../query/versions";
import { TokenList } from "@uniswap/token-lists";
import { useChainId } from "wagmi";
import { apiUrl } from "../api";

export function useTokensList() {
  const chainId = useChainId();
  const queryParamsStr = chainId ? `?chains=${chainId}` : "";

  const tokensList = useQuery({
    queryKey: ["tokensList", QV.tokensList, queryParamsStr],
    queryFn: async () => {
      const r = await fetch(apiUrl("tokensList", { chains: [chainId] }));

      console.log("fetch tokens list", r);

      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      return r.json() as Promise<TokenList[]>;
    },
    staleTime: 1000 * 60 * 60,
  });

  return tokensList;
}

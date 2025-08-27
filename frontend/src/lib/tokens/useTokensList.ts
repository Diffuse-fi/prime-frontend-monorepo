import { useQuery } from "@tanstack/react-query";
import { QV } from "../query/versions";
import { TokenList } from "@uniswap/token-lists";
import { useChainId } from "wagmi";

export function useTokenList() {
  const chainId = useChainId();
  console.log("chainId", chainId);
  const queryParamsStr = chainId ? `?chains=${chainId}` : "";

  const tokenList = useQuery({
    queryKey: ["tokenList", QV.tokensList, queryParamsStr],
    queryFn: async () => {
      const r = await fetch(`/api/token-list${queryParamsStr}`);

      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      return r.json() as Promise<TokenList[]>;
    },
    staleTime: 1000 * 60 * 60 * 24,
    initialData: [],
  });

  return tokenList;
}

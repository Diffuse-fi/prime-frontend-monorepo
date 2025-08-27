import { TokenInfo } from "@uniswap/token-lists";
import NodeCache from "node-cache";
import {
  AllowedTokenList,
  TokenInfoArraySchema,
  TokenListResponseSchema,
} from "./validations";
import { getAvailableTokensForAllChains } from "./allowlist";
import { isAddress } from "viem";

// Official Uniswap token list URL
const UNISWAP_DEFAULT_LIST = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 * 7 });

function getFilteredTokens(tokens: TokenInfo[], allowed: AllowedTokenList): TokenInfo[] {
  const allowedSet = new Set(
    allowed.map(t => `${t.chainId.toString().toLowerCase()}:${t.address.toLowerCase()}`)
  );

  return tokens.filter(
    t =>
      isAddress(t.address) &&
      allowedSet.has(`${t.chainId.toString().toLowerCase()}:${t.address.toLowerCase()}`)
  );
}

export async function getTokenList(): Promise<TokenInfo[]> {
  const cached = cache.get<TokenInfo[]>("uniswap-token-list");
  const availableTokensInStrategies = await getAvailableTokensForAllChains();

  if (cached) {
    const parsedCache = TokenInfoArraySchema.parse(cached);
    const filteredTokens = getFilteredTokens(parsedCache, availableTokensInStrategies);

    return filteredTokens;
  }

  const res = await fetch(UNISWAP_DEFAULT_LIST);

  if (!res.ok) throw new Error("Failed to fetch token list");

  const list = await res.json();
  const parsed = TokenListResponseSchema.parse(list);
  const filtered = getFilteredTokens(parsed.tokens, availableTokensInStrategies);

  cache.set("uniswap-token-list", parsed.tokens);

  return filtered;
}

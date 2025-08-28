import { TokenInfo, TokenInfoArraySchema } from "./validations";

// should follow offical tokenlist schema format https://tokenlists.org
import tokensMeta from "./meta.json" with { type: "json" };

export async function getTokenMetaList(): Promise<TokenInfo[]> {
  return TokenInfoArraySchema.parseAsync(tokensMeta.chains.flatMap(c => c.tokens));
}

export function populateTokenListWithMeta({
  list,
  meta,
}: {
  list: TokenInfo[];
  meta: TokenInfo[];
}): TokenInfo[] {
  const map = new Map<string, TokenInfo>();

  for (const token of list) {
    map.set(`${token.chainId}-${token.address.toLowerCase()}`, token);
  }

  for (const token of meta) {
    const key = `${token.chainId}-${token.address.toLowerCase()}`;
    const existing = map.get(key);

    if (!existing) {
      continue;
    }

    map.set(key, {
      ...existing,
      logoURI: token.logoURI ?? existing.logoURI,
      name: token.name ?? existing.name,
      symbol: token.symbol ?? existing.symbol,
      decimals: token.decimals ?? existing.decimals,
      extensions: {
        ...existing.extensions,
        ...token.extensions,
      },
    });
  }

  return Array.from(map.values());
}

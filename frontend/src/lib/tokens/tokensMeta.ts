import { TokenInfo, TokenInfoArraySchema } from "./validations";

// should follow offical tokenlist schema format https://tokenlists.org
import tokensMeta from "./meta.json" with { type: "json" };

export async function getTokenMetaList(): Promise<TokenInfo[]> {
  return TokenInfoArraySchema.parseAsync(tokensMeta.chains.flatMap(c => c.tokens));
}

export function populateTokenListWithMeta<T extends TokenInfo>({
  list,
  meta,
}: {
  list: T[];
  meta: TokenInfo[];
}): T[] {
  const result: T[] = [];

  for (const token of list) {
    const metaToken = meta.find(
      t =>
        t.chainId === token.chainId &&
        t.address.toLowerCase() === token.address.toLowerCase()
    );

    if (metaToken) {
      result.push({
        ...token,
        logoURI: metaToken.logoURI ?? token.logoURI,
        name: metaToken.name ?? token.name,
        symbol: metaToken.symbol ?? token.symbol,
        decimals: metaToken.decimals ?? token.decimals,
        extensions: {
          ...token.extensions,
          ...metaToken.extensions,
        },
      });
    } else {
      result.push(token);
    }
  }

  return result;
}

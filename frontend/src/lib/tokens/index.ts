import { TokenInfo } from "@uniswap/token-lists";
import { AllowedTokenList, TokenInfoArraySchema } from "./validations";
import { getTokensAvailableBySdk } from "./allowlist";
import { isAddress } from "viem";

// should follow offical tokenlist schema format https://tokenlists.org
import tokensMeta from "./meta.json" with { type: "json" };

function getFilteredTokens(
  tokensMeta: TokenInfo[],
  allowed: AllowedTokenList
): TokenInfo[] {
  const allowedSet = new Set(
    allowed.map(t => `${t.chainId.toString().toLowerCase()}:${t.address.toLowerCase()}`)
  );

  return tokensMeta.filter(
    t =>
      isAddress(t.address) &&
      allowedSet.has(`${t.chainId.toString().toLowerCase()}:${t.address.toLowerCase()}`)
  );
}

export async function getTokenList(): Promise<TokenInfo[]> {
  const availableTokensInStrategies = await getTokensAvailableBySdk();
  const tokensListFromMeta = tokensMeta.chains.flatMap(c => c.tokens);

  const parsed = TokenInfoArraySchema.parse(tokensListFromMeta);
  const filtered = getFilteredTokens(parsed, availableTokensInStrategies);

  return filtered;
}

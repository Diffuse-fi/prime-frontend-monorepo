import { Vault } from "@diffuse/sdk-js";
import { getAvailableChains } from "../wagmi/chains";
import { createPublicClient, http } from "viem";
import { AllowedTokensSchema } from "./validations";

const vaults = getAvailableChains().map(
  chain =>
    new Vault({
      chainId: chain.id,
      client: {
        public: createPublicClient({
          chain,
          transport: http(chain.rpcUrls.default.http[0]),
        }),
      },
    })
);

// We request all tokens available in strategies across all chains
// each time in order to have the most up-to-date list
// without needing to redeploy the frontend.
export async function getAvailableTokensForAllChains() {
  const promises = vaults.map(v =>
    v.getStrategies().then(res =>
      res
        .flatMap(tkns => tkns.token)
        .map(tkn => ({
          chainId: v.chainId,
          address: tkn.asset,
          symbol: tkn.symbol,
        }))
    )
  );

  const results = await Promise.all(promises);

  return AllowedTokensSchema.parse(results.flat());
}

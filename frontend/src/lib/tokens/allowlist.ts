import "server-only";
import { Vault, VaultRegistry } from "@diffuse/sdk-js";
import { getAvailableChains } from "../chains";
import { createPublicClient, http } from "viem";
import { AllowedTokensSchema } from "./validations";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 * 7 });

const vaultRegistries = getAvailableChains().map(
  chain =>
    new VaultRegistry({
      chainId: chain.id,
      client: {
        public: createPublicClient({
          chain,
          transport: http(chain.rpcUrls.default.http[0]),
        }),
      },
    })
);

export async function getTokensAvailableBySdk() {
  const cached = cache.get("allowed-tokens");

  if (cached) {
    return AllowedTokensSchema.parse(cached);
  }

  const promises = vaultRegistries.map(vr =>
    vr.getVaults().then(vaults =>
      vaults.map(
        v =>
          new Vault({
            chainId: vr.chainId,
            address: v.vault,
            client: vr.init.client,
          })
      )
    )
  );
  const vaultsArrays = await Promise.all(promises);
  const vaults = vaultsArrays.flat();

  const tknListPromises = vaults.map(v =>
    v.getAssets().then(assets =>
      assets.map(({ asset, symbol }) => ({
        chainId: v.chainId,
        address: asset,
        symbol,
      }))
    )
  );

  const results = await Promise.all(tknListPromises).then(res => res.flat());

  cache.set("allowed-tokens", results);

  return AllowedTokensSchema.parse(results);
}

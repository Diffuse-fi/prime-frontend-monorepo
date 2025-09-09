import { AssetInfo, AssetInfoArraySchema } from "./validations";

// should follow offical tokenlist schema format https://tokenlists.org
import assetsMetaJson from "./meta.json" with { type: "json" };

export async function getTokenMetaList(): Promise<AssetInfo[]> {
  return AssetInfoArraySchema.parseAsync(assetsMetaJson.chains.flatMap(c => c.assets));
}

export function populateAssetListWithMeta<T extends AssetInfo>({
  list,
  meta,
}: {
  list: T[];
  meta: AssetInfo[];
}): T[] {
  const result: T[] = [];

  for (const asset of list) {
    const metaAsset = meta.find(
      t =>
        t.chainId === asset.chainId &&
        t.address.toLowerCase() === asset.address.toLowerCase()
    );

    if (metaAsset) {
      result.push({
        ...asset,
        logoURI: metaAsset.logoURI ?? asset.logoURI,
        name: metaAsset.name ?? asset.name,
        symbol: metaAsset.symbol ?? asset.symbol,
        decimals: metaAsset.decimals ?? asset.decimals,
        extensions: {
          ...asset.extensions,
          ...metaAsset.extensions,
        },
      });
    } else {
      result.push(asset);
    }
  }

  return result;
}

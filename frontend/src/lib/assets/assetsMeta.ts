import { AssetInfo } from "@diffuse/config";
import { ASSETS } from "@diffuse/config";

const assetsAllChains = ASSETS.chains.flatMap(c => c.assets);

export function populateAssetListWithMeta<T extends AssetInfo>(list: T[]): T[] {
  return list.map(a => populateAssetWithMeta(a));
}

export function populateAssetWithMeta<T extends AssetInfo>(asset: T): T {
  const metaAsset = assetsAllChains.find(
    t =>
      t.chainId === asset.chainId &&
      t.address.toLowerCase() === asset.address.toLowerCase()
  );

  if (metaAsset) {
    return {
      ...asset,
      decimals: metaAsset.decimals ?? asset.decimals,
      extensions: {
        ...asset.extensions,
        ...metaAsset.extensions,
      },
      logoURI: metaAsset.logoURI ?? asset.logoURI,
      name: metaAsset.name ?? asset.name,
      symbol: metaAsset.symbol ?? asset.symbol,
    };
  }

  return asset;
}

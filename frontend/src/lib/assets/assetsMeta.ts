import { AssetInfo } from "@diffuse/config";

export function populateAssetWithMeta<T extends AssetInfo>({
  asset,
  meta,
}: {
  asset: T;
  meta: AssetInfo[];
}): T {
  const metaAsset = meta.find(
    t =>
      t.chainId === asset.chainId &&
      t.address.toLowerCase() === asset.address.toLowerCase()
  );

  if (metaAsset) {
    return {
      ...asset,
      logoURI: metaAsset.logoURI ?? asset.logoURI,
      name: metaAsset.name ?? asset.name,
      symbol: metaAsset.symbol ?? asset.symbol,
      decimals: metaAsset.decimals ?? asset.decimals,
      extensions: {
        ...asset.extensions,
        ...metaAsset.extensions,
      },
    };
  }

  return asset;
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
    result.push(populateAssetWithMeta({ asset, meta }));
  }

  return result;
}

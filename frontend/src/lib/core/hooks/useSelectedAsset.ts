"use client";

import { AssetInfo, AssetInfoSchema } from "@diffuse/config";
import { useEffect } from "react";

import { useLocalStorage } from "../../misc/useLocalStorage";

const validateAssetInfo = (value: AssetInfo | null) => {
  return AssetInfoSchema.safeParse(value).success;
};

export function useSelectedAsset(allowedTokens: AssetInfo[]) {
  const [selectedAsset, setSelectedAsset] = useLocalStorage<AssetInfo | null>(
    "lend-selected-asset",
    null,
    validateAssetInfo
  );

  useEffect(() => {
    if (!selectedAsset && allowedTokens.length > 0) {
      setSelectedAsset(allowedTokens[0]);
    }

    if (selectedAsset && !allowedTokens.some(t => t.address === selectedAsset.address)) {
      setSelectedAsset(allowedTokens.length > 0 ? allowedTokens[0] : null);
    }
  }, [allowedTokens, selectedAsset, setSelectedAsset]);

  return [selectedAsset, setSelectedAsset] as const;
}

"use client";

import { useEffect } from "react";
import { useLocalStorage } from "../misc/useLocalStorage";
import { AssetInfo, AssetInfoSchema } from "../assets/validations";

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

    if (selectedAsset && !allowedTokens.find(t => t.address === selectedAsset.address)) {
      setSelectedAsset(allowedTokens.length > 0 ? allowedTokens[0] : null);
    }
  }, [allowedTokens, selectedAsset, setSelectedAsset]);

  return [selectedAsset, setSelectedAsset] as const;
}

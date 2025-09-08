"use client";

import { useEffect } from "react";
import { useLocalStorage } from "../misc/useLocalStorage";
import { TokenInfo, TokenInfoSchema } from "../tokens/validations";

const validateTokenInfo = (value: TokenInfo | null) => {
  return TokenInfoSchema.safeParse(value).success;
};

export function useSelectedAsset(allowedTokens: TokenInfo[]) {
  const [selectedAsset, setSelectedAsset] = useLocalStorage<TokenInfo | null>(
    "lend-selected-token",
    null,
    validateTokenInfo
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

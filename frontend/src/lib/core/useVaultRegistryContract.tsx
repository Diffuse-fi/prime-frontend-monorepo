"use client";

import { getAddress, type Address } from "viem";
import { useClients } from "../wagmi/useClients";
import { VaultRegistry } from "@diffuse/sdk-js";
import { useMemo } from "react";

export function useVaultRegistryContract(addressOverride?: Address) {
  const { chainId, publicClient, walletClient } = useClients();

  const vaultRegistry = useMemo(() => {
    if (!publicClient) return null;

    const normalized = addressOverride ? getAddress(addressOverride) : undefined;

    return new VaultRegistry({
      client: { public: publicClient, wallet: walletClient },
      chainId,
      address: normalized,
    });
  }, [publicClient, walletClient, chainId, addressOverride]);

  return vaultRegistry;
}

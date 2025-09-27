"use client";

import { getAddress, type Address } from "viem";
import { VaultRegistry } from "@diffuse/sdk-js";
import { useMemo } from "react";
import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";
import { usePublicClient } from "wagmi";

export function useVaultRegistryContract(addressOverride?: Address) {
  const { chainId } = useReadonlyChain();
  const publicClient = usePublicClient({ chainId });

  const vaultRegistry = useMemo(() => {
    if (!publicClient) return null;

    const normalized = addressOverride ? getAddress(addressOverride) : undefined;

    return new VaultRegistry({
      client: { public: publicClient },
      chainId,
      address: normalized,
    });
  }, [publicClient, chainId, addressOverride]);

  return vaultRegistry;
}

"use client";

import { getAddress, type Address } from "viem";
import { useClients } from "../../wagmi/useClients";
import { VaultRegistry } from "@diffuse/sdk-js";
import { useMemo } from "react";
import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";
import { usePublicClient } from "wagmi";

export function useVaultRegistryContract(addressOverride?: Address) {
  const { chainId } = useReadonlyChain();
  const publicClient = usePublicClient({ chainId });
  const { walletClient } = useClients();

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

"use client";

import { getAddress, type Address } from "viem";
import { useClients } from "../wagmi/useClients";
import { Vault } from "@defuse/sdk-js";
import { useMemo } from "react";

export function useVaultContract(addressOverride?: Address) {
  const { chainId, publicClient, walletClient } = useClients();

  const vault = useMemo(() => {
    if (!publicClient) return null;

    const normalized = addressOverride
      ? (getAddress(addressOverride) as Address)
      : undefined;

    return new Vault({
      client: { public: publicClient, wallet: walletClient },
      chainId,
      address: normalized,
    });
  }, [publicClient, walletClient, chainId, addressOverride]);

  return vault;
}

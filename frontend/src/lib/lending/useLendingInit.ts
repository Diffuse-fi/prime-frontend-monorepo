"use client";

import type { Address } from "viem";
import { useClients } from "../wagmi/useClients";

export function useLendingInit(addressOverride?: Address) {
  const { chainId, publicClient, walletClient } = useClients();

  const init = publicClient
    ? {
        client: { public: publicClient, wallet: walletClient },
        chainId,
        address: addressOverride,
      }
    : undefined;

  return init;
}

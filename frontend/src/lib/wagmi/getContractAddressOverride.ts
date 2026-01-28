import { Address, getAddress } from "viem";

import { env } from "@/env";

export function getContractAddressOverride(
  chainId: number,
  contractName: string
): Address | null {
  try {
    const addressesOverrides = env.NEXT_PUBLIC_ADDRESSES_OVERRIDES;
    if (!addressesOverrides) return null;

    const chainOverrides = addressesOverrides[chainId.toString()];
    if (!chainOverrides) return null;

    const contractOverride = chainOverrides[contractName];
    if (!contractOverride || !contractOverride.current) return null;

    return getAddress(contractOverride.current);
  } catch (error) {
    console.error("Error parsing contract address overrides:", error);
    return null;
  }
}

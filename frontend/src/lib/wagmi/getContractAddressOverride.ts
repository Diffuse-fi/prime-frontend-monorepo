import { Address, getAddress } from "viem";

import { AddressesOverrides } from "./addresses";

export function getContractAddressOverride(
  chainId: number,
  contractName: string,
  addressesOverrides?: AddressesOverrides
): Address | null {
  try {
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

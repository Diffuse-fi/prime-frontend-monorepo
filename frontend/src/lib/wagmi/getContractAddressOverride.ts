import { env } from "@/env";

export function getContractAddressOverride(
  chainId: number,
  contractName: string
): null | string {
  try {
    const addressesOverrides = env.NEXT_PUBLIC_ADDRESSES_OVERRIDES;
    if (!addressesOverrides) return null;

    const chainOverrides = addressesOverrides[chainId.toString()];
    if (!chainOverrides) return null;

    const contractOverride = chainOverrides[contractName];
    if (!contractOverride || !contractOverride.current) return null;

    return contractOverride.current;
  } catch (error) {
    console.error("Error parsing contract address overrides:", error);
    return null;
  }
}

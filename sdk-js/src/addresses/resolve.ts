import { Address, getAddress, isAddress } from "viem";
import { type ContractName, getAddressFor } from "./addressBook";
import { InvalidAddressError } from "../errors";

export function resolveAddress(opts: {
  chainId: number;
  contract: ContractName;
  addressOverride?: Address;
}): Address {
  const { chainId, contract, addressOverride } = opts;
  if (addressOverride) {
    if (!isAddress(addressOverride)) {
      throw new InvalidAddressError(addressOverride, {
        chainId,
        contract,
      });
    }

    return getAddress(addressOverride);
  }

  const addr = getAddressFor(chainId, contract);
  return getAddress(addr);
}

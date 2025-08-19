import { Address, getAddress, isAddress } from "viem";
import { type ContractName, getAddressFor } from "./addressBook";
import { AddressNotFoundError, InvalidAddressError } from "../errors";

export function resolveAddress(opts: {
  chainId: number;
  contract: ContractName;
  addressOverride?: Address;
}): `0x${string}` {
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

  try {
    const addr = getAddressFor(chainId, contract, version);
    return getAddress(addr);
  } catch (e) {
    if (e?.code === "ADDRESS_NOT_FOUND") throw e;

    throw new AddressNotFoundError({ chainId, contract, version });
  }
}

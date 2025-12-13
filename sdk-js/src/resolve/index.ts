import { ADDRESSES } from "@diffuse/config";
import { Address, getAddress, isAddress } from "viem";

import { AddressNotFoundError, InvalidAddressError } from "../errors";

export function resolveAddress(opts: {
  addressOverride?: Address;
  chainId: number;
  contract: string;
}): Address {
  const { addressOverride, chainId, contract } = opts;
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

function getAddressFor(chainId: number, contract: string): Address {
  const chain = ADDRESSES.chains.find(c => c.chainId === chainId);

  if (!chain) {
    throw new AddressNotFoundError({
      chainId,
      contract,
      meta: "No addresses configured for this chain ID",
    });
  }

  const entry = chain.contracts[contract];

  if (!entry || !entry.current) {
    throw new AddressNotFoundError({
      chainId,
      contract,
      meta: "No address configured for this contract on the specified chain",
    });
  }

  return entry.current;
}

import { Address, getAddress, isAddress } from "viem";
import { AddressNotFoundError, InvalidAddressError } from "../errors";
import { ADDRESSES } from "@diffuse/config";

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

export function resolveAddress(opts: {
  chainId: number;
  contract: string;
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

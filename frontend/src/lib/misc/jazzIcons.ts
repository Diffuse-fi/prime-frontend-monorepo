import { Address } from "viem";

function jsNumberForAddress(addr: Address) {
  return Number.parseInt(addr.slice(2, 10), 16);
}

const seedPerAddressMap = new Map<Address, number>();
const seedPerChainMap = new Map<number, number>();

export function stableSeedForAddress(address: Address) {
  if (!seedPerAddressMap.has(address)) {
    seedPerAddressMap.set(address, jsNumberForAddress(address));
  }

  return seedPerAddressMap.get(address)!;
}

export function stableSeedForChainId(chainId: number) {
  if (!seedPerChainMap.has(chainId)) {
    seedPerChainMap.set(
      chainId,
      jsNumberForAddress(`0x${chainId.toString(16).padStart(8, "0")}`)
    );
  }

  return seedPerChainMap.get(chainId)!;
}

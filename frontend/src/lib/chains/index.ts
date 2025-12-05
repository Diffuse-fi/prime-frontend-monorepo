import { Chain } from "@rainbow-me/rainbowkit";
import { env } from "@/env";
import { CHAINS } from "@diffuse/config";

export function getAvailableChains() {
  return CHAINS;
}

export function getInitialChain(): Chain {
  const foundChain = getAvailableChains().find(
    c => c.id === env.NEXT_PUBLIC_INITIAL_CHAIN_ID
  );
  return foundChain ?? getAvailableChains()[0];
}

export function getAvailableChainsIds(): number[] {
  return getAvailableChains().map(c => c.id);
}

const chainsById: Record<number, Chain> = Object.fromEntries(
  getAvailableChains().map(c => [c.id, c])
);

export function getChainById(chainId: number): Chain | undefined {
  return chainsById[chainId];
}

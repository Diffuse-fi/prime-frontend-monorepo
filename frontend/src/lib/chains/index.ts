import { Chain } from "@rainbow-me/rainbowkit";
import {
  berachain as beraDefault,
  mainnet,
  arbitrum,
  sonic as sonicDefault,
} from "viem/chains";
import { getStableChainMeta } from "./meta";
import { env } from "@/env";

export const berachain = {
  ...beraDefault,
  ...getStableChainMeta(beraDefault.id),
};

export const ethMainnet = {
  ...mainnet,
  ...getStableChainMeta(mainnet.id),
};

export const arbitrumOne = {
  ...arbitrum,
  ...getStableChainMeta(arbitrum.id),
};

export const sonic = {
  ...sonicDefault,
  ...getStableChainMeta(sonicDefault.id),
};

export const chains = {
  testnets: [] as Chain[],
  mainnets: [ethMainnet, berachain, arbitrumOne, sonic],
} as const satisfies Record<"testnets" | "mainnets", readonly Chain[]>;

export function getAvailableChains(): readonly [Chain, ...Chain[]] {
  return [
    ...chains.mainnets,
    ...chains.testnets,
  ] as [Chain, ...Chain[]];
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

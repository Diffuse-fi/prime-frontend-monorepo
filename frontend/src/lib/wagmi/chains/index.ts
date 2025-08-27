import { Chain } from "@rainbow-me/rainbowkit";
import { berachain } from "./berachain";
import { ethMainnet } from "./mainnet";

export const chains = {
  testnets: [berachain] as const,
  mainnets: [ethMainnet],
} as const satisfies Record<"testnets" | "mainnets", readonly Chain[]>;

export function getAvailableChains(): readonly [Chain, ...Chain[]] {
  return [
    ...chains.mainnets,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? chains.testnets : []),
  ];
}

export function getInitialChain(): Chain {
  return process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? berachain : ethMainnet;
}

export function getAvailableChainsIds(): number[] {
  return getAvailableChains().map(c => c.id);
}

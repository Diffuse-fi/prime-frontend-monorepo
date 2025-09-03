import { Chain } from "@rainbow-me/rainbowkit";
import { berachain } from "./berachain";
import { ethMainnet } from "./mainnet";

const testnetsEnabled = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true";
const mainnetsEnabled = process.env.NEXT_PUBLIC_ENABLE_MAINNETS === "true";

if (!testnetsEnabled && !mainnetsEnabled) {
  throw new Error("At least one of testnets or mainnets must be enabled");
}

export const chains = {
  testnets: [] as Chain[],
  mainnets: mainnetsEnabled ? ([ethMainnet, berachain] as const) : [],
} as const satisfies Record<"testnets" | "mainnets", readonly Chain[]>;

export function getAvailableChains(): readonly [Chain, ...Chain[]] {
  return [
    ...chains.mainnets,
    ...chains.testnets,
  ] as [Chain, ...Chain[]];
}

export function getInitialChain(): Chain | undefined {
  return testnetsEnabled ? undefined : berachain;
}

export function getAvailableChainsIds(): number[] {
  return getAvailableChains().map(c => c.id);
}

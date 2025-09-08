import { berachain, mainnet } from "viem/chains";

export const chainLogos: Record<
  number,
  {
    iconUrl?: string;
    iconBackground?: string;
  }
> = {
  [mainnet.id]: {
    iconUrl: "/ethereum-logo.svg",
    iconBackground: "transparent",
  },
  [berachain.id]: {
    iconUrl: "/berachain-logo.svg",
    iconBackground: "#814626",
  },
};

export function getStableChainMeta(chainId: number) {
  return (
    chainLogos[chainId] ?? {
      iconUrl: undefined,
      iconBackground: undefined,
    }
  );
}

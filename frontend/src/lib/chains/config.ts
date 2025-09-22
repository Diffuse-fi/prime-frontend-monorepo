import { env } from "@/env";
import { berachain, mainnet, arbitrum } from "viem/chains";

export const chainLogos: Record<
  number,
  {
    iconUrl?: string;
    iconBackground?: string;
  }
> = {
  [mainnet.id]: {
    iconUrl: "/ethereum-logo.svg?v=1",
    iconBackground: "transparent",
  },
  [berachain.id]: {
    iconUrl: "/berachain-logo.svg?v=1",
    iconBackground: "#814626",
  },
  [arbitrum.id]: {
    iconUrl: "/arbitrum-logo.svg?v=1",
    iconBackground: "#28a0f0",
  },
};

export const RPCs: Record<number, string[]> = {
  [mainnet.id]: [
    env.NEXT_PUBLIC_RPC_MAINNET,
    "https://eth.merkle.io",
    "https://rpc.ankr.com/eth",
  ].filter(Boolean) as string[],
  [arbitrum.id]: [
    env.NEXT_PUBLIC_RPC_ARBITRUM,
    "https://arb1.arbitrum.io/rpc",
  ].filter(Boolean) as string[],
  [berachain.id]: [
    env.NEXT_PUBLIC_RPC_BERA,
    "https://rpc.berachain.com/",
  ].filter(Boolean) as string[],
};

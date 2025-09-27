import { berachain, mainnet, arbitrum, sonic } from "viem/chains";

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
  [sonic.id]: {
    iconUrl: "/sonic-logo.svg?v=1",
    iconBackground: "transparent",
  },
};

export const RPCs: Record<number, string[]> = {
  [mainnet.id]: [
    "https://eth.merkle.io",
  ].filter(Boolean) as string[],
  [arbitrum.id]: [
    "https://arb1.arbitrum.io/rpc",
  ].filter(Boolean) as string[],
  [berachain.id]: [
    "https://rpc.berachain.com/",
  ].filter(Boolean) as string[],
  [sonic.id]: [
    "https://rpc.soniclabs.com",
  ].filter(Boolean) as string[],
};

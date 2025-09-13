import { getAddress } from "viem";
import { berachain, mainnet } from "viem/chains";

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
};

export function getStableChainMeta(chainId: number) {
  return (
    chainLogos[chainId] ?? {
      iconUrl: undefined,
      iconBackground: undefined,
    }
  );
}

export function getContractExplorerUrl(chainId: number, contractAddress: string) {
  const normalized = getAddress(contractAddress);

  let rpcUrl: string | undefined;

  switch (chainId) {
    case mainnet.id:
      rpcUrl = mainnet.blockExplorers?.default.url;
      break;
    case berachain.id:
      rpcUrl = berachain.blockExplorers?.default.url;
      break;
  }

  if (!rpcUrl) return null;

  return `${rpcUrl.replace(/\/$/, "")}/address/${normalized}`;
}

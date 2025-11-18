import { getAddress } from "viem";
import { getAvailableChains } from ".";
import { berachain, mainnet, arbitrum, sonic } from "viem/chains";

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

export function getContractExplorerUrl(chainId: number, contractAddress: string) {
  const normalized = getAddress(contractAddress);

  const chain = getAvailableChains().find(c => c.id === chainId);
  const rpcUrl = chain?.blockExplorers?.default.url;

  if (!rpcUrl) return null;

  return `${rpcUrl.replace(/\/$/, "")}/address/${normalized}`;
}

export const getChainRpcUrls = (chainId: number): string[] => {
  const urls = RPCs[chainId];
  return urls ?? [];
};

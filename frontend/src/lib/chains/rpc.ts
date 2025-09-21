import { getAddress } from "viem";
import { getAvailableChains } from ".";
import { RPCs } from "./config";

export function getContractExplorerUrl(chainId: number, contractAddress: string) {
  const normalized = getAddress(contractAddress);

  const chain = getAvailableChains().find(c => c.id === chainId);
  const rpcUrl = chain?.blockExplorers?.default.url;

  if (!rpcUrl) return null;

  return `${rpcUrl.replace(/\/$/, "")}/address/${normalized}`;
}

export const getChainRpcUrls = (chainId: number): string[] => {
  return RPCs[chainId];
};

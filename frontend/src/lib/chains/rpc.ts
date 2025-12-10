import { getAddress } from "viem";
import { getAvailableChains } from ".";

export const customRpcMap: Record<number, string[]> = {
  1: [
    "https://ethereum.publicnode.com",
  ],
};

export function getContractExplorerUrl(chainId: number, contractAddress: string) {
  const normalized = getAddress(contractAddress);

  const chain = getAvailableChains().find(c => c.id === chainId);
  const rpcUrl = chain?.blockExplorers?.default.url;

  if (!rpcUrl) return null;

  return `${rpcUrl.replace(/\/$/, "")}/address/${normalized}`;
}

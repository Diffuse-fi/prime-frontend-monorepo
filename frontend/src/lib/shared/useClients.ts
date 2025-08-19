import { Address, PublicClient, WalletClient } from "viem";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";

type Clients = {
  address?: Address;
  isConnected: boolean;
  chainId: number;
  publicClient?: PublicClient;
  walletClient?: WalletClient;
};

export function useClients(): Clients {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  return { address, isConnected, chainId, publicClient, walletClient };
}

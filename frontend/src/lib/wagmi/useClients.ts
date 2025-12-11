import { Address, PublicClient, WalletClient } from "viem";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";

type Clients = {
  address?: Address;
  chainId: number;
  isConnected: boolean;
  publicClient?: PublicClient;
  walletClient?: WalletClient;
};

export function useClients(): Clients {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  return { address, chainId, isConnected, publicClient, walletClient };
}

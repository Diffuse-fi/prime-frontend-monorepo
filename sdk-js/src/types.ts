import { Address, PublicClient, WalletClient } from "viem";

export type Init = {
  client: {
    public: PublicClient;
    wallet?: WalletClient;
  };
  chainId: number;
  address?: Address;
};

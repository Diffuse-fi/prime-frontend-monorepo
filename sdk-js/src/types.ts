import { Address, PublicClient, WalletClient } from "viem";

export type Init = {
  address?: Address;
  chainId: number;
  client: {
    public: PublicClient;
    wallet?: WalletClient;
  };
  // TODO - later we can add a flag to skip simulateWrites
  simulateWrites?: boolean;
};

export type InitReadonly = Omit<Init, "client" | "simulateWrites"> & {
  client: {
    public: PublicClient;
  };
};

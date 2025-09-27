import { Address, PublicClient, WalletClient } from "viem";

export type Init = {
  client: {
    public: PublicClient;
    wallet?: WalletClient;
  };
  chainId: number;
  address?: Address;
  // TODO - later we can add a flag to skip simulateWrites
  simulateWrites?: boolean;
};

export type InitReadonly = Omit<Init, "client" | "simulateWrites"> & {
  client: {
    public: PublicClient;
  };
};

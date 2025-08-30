import type { Vault } from "@diffuse/sdk-js";
import { Address } from "viem";
import { TokenInfo } from "../tokens/validations";

export type VaultWithAddress = {
  name: string;
  address: Address;
  targetApr: bigint;
  vault: Vault;
};

export type VaultFullInfo = VaultWithAddress & {
  assets: TokenInfo[];
  strategies: Array<{
    apr: bigint;
    endDate: bigint;
    tokenAllocation: bigint;
  }>;
};

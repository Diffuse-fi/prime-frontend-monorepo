import type { Vault } from "@diffuse/sdk-js";
import { Address } from "viem";
import { TokenInfo } from "../tokens/validations";

export type VaultFullInfo = {
  assets: TokenInfo[];
  name: string;
  address: Address;
  targetApr: bigint;
  strategies: Array<{
    apr: bigint;
    endDate: bigint;
    tokenAllocation: bigint;
  }>;
  contract: Vault;
};

export type SelectedVault = {
  address: Address;
  assetAddress: Address;
  assetSymbol: string;
  assetDecimals?: number;
  amount: bigint;
};

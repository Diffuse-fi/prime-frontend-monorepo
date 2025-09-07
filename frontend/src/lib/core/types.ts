import type { Vault } from "@diffuse/sdk-js";
import { Address, Hash } from "viem";
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
  limits: {
    maxDeposit?: bigint;
    maxWithdraw?: bigint;
  };
};

export type SelectedVault = {
  address: Address;
  assetAddress: Address;
  assetSymbol: string;
  assetDecimals: number;
  amount: bigint;
  legacyAllowance: boolean;
  chainId: number;
};

export type TxPhase =
  | "idle"
  | "checking"
  | "awaiting-signature"
  | "broadcasting"
  | "pending"
  | "replaced"
  | "success"
  | "error";

export type TxInfo = {
  phase: TxPhase;
  hash?: Hash;
  errorMessage?: string;
};

export type TxState = Record<Address, TxInfo>;

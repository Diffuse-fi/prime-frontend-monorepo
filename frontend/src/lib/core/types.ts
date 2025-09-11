import type { Vault } from "@diffuse/sdk-js";
import { Address, Hash } from "viem";
import { AssetInfo } from "../assets/validations";

export type VaultFullInfo = {
  assets: AssetInfo[];
  name: string;
  address: Address;
  targetApr: bigint;
  strategies: Array<{
    apr: bigint;
    endDate: bigint;
    balance: bigint;
  }>;
  contract: Vault;
  limits: {
    maxDeposit?: bigint;
    maxWithdraw?: bigint;
  };
  totalAssets?: bigint;
  RiskLevel: VaultRiskLevel;
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

export type LenderPosition = {
  vault: VaultFullInfo;
  asset: AssetInfo;
  balance: bigint;
  accruedYield: bigint;
};

export type BatchResult = {
  hashes: Record<Address, Hash>;
  errors: Record<Address, Error>;
};

export type VaultRiskLevel =
  | 0 // none
  | 1 // low
  | 2 // medium
  | 3; // high

import { AssetInfo } from "@diffuse/config";
import { type Vault } from "@diffuse/sdk-js";
import { Address, Hash, Hex } from "viem";

export type BorrowerPosition = {
  asset: AssetInfo;
  assetsBorrowed: bigint;
  blockNumber: number;
  collateralGiven: bigint;
  collateralType: number;
  enterTimeOrDeadline: number;
  id: bigint;
  leverage: bigint;
  liquidationPrice: bigint;
  strategyBalance: bigint;
  strategyId: bigint;
  subjectToLiquidation: boolean;
  user: Address;
  vault: VaultFullInfo;
};

export type LenderPosition = {
  accruedYield: bigint;
  asset: AssetInfo;
  balance: bigint;
  vault: VaultFullInfo;
};

export type SelectedVault = {
  address: Address;
  amount: bigint;
  assetAddress: Address;
  assetDecimals: number;
  assetSymbol: string;
  chainId: number;
  legacyAllowance: boolean;
};

export type Strategy = {
  apr: bigint;
  balance: bigint;
  endDate: bigint;
  id: bigint;
  isDisabled: boolean;
  maxLeverage: number;
  minLeverage: number;
  name: string;
  pool: Hex;
  token: AssetInfo;
};

export type TxInfo = {
  errorMessage?: string;
  hash?: Hash;
  phase: TxPhase;
};

export type TxPhase =
  | "awaiting-signature"
  | "broadcasting"
  | "checking"
  | "error"
  | "idle"
  | "pending"
  | "replaced"
  | "success";

export type TxState = Record<Address, TxInfo>;

export type VaultFullInfo = {
  address: Address;
  assets: AssetInfo[];
  availableLiquidity: bigint;
  contract: Vault;
  curator?: Address;
  feeData: {
    earlyWithdrawalFee: number;
    liquidationFee: number;
    spreadFee: number;
  };
  name: string;
  riskLevel: VaultRiskLevel;
  strategies: Strategy[];
  targetApr: bigint;
  totalAssets?: bigint;
};

export type VaultLimits = {
  address: Address;
  chainId: number;
  maxDeposit?: bigint;
  maxWithdraw?: bigint;
};

export type VaultRiskLevel =
  | 0 // none
  | 1 // low
  | 2 // medium
  | 3; // high

import type { Address, Hash, Hex } from "viem";

export type AegisExitResult = {
  error?: Error;
  hash?: Hash;
};

export type AegisExitSelected = {
  address: Address;
  chainId: number;
  collateralAsset: Address;
  deadline: bigint;
  isAegisStrategy: boolean;
  positionId: bigint;
  slippage: string;
  strategyId: bigint;
};

export type AegisExitStage = -1 | 0 | 1 | 2 | 3;

export type AegisExitStageInfo = {
  message: string;
  stage: AegisExitStage;
};

export type AegisExitTxInfo = {
  errorMessage?: string;
  hash?: Hash;
  phase: AegisExitTxPhase;
};

export type AegisExitTxKey = "finalize" | "lock" | "redeem";

export type AegisExitTxPhase =
  | "awaiting-signature"
  | "checking"
  | "error"
  | "idle"
  | "pending"
  | "replaced"
  | "success";

export type AegisExitTxState = Partial<Record<AegisExitTxKey, AegisExitTxInfo>>;

export type AegisRedeemRequest = {
  collateralAsset: Address;
  slippageBps: bigint;
  yusdAmount: bigint;
};

export type AegisRedeemResponse = {
  encodedData: Hex;
};

export type AegisRouteInfo = {
  instanceAddress: Address;
  instanceIndex: bigint;
  yusdAmount: bigint;
};

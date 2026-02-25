export const defaultMinLeverage = 100;
export const defaultMaxLeverage = 1000;
export const leverageAdjustmentForPt = 10;
export const LEVERAGE_RATE = 100;

export type BorrowAction =
  | {
      borrow: bigint;
      borrowDecimals: number;
      collateralDecimals: number;
      type: "SET_BORROW";
    }
  | {
      borrowDecimals: number;
      collateral: bigint;
      collateralDecimals: number;
      type: "SET_COLLATERAL";
    }
  | {
      borrowDecimals: number;
      collateralDecimals: number;
      leverage: number;
      type: "SET_LEVERAGE";
    }
  | { type: "RESET" };

export type BorrowState = { borrow: bigint; collateral: bigint; leverage: number };

export function borrowReducer(state: BorrowState, action: BorrowAction): BorrowState {
  switch (action.type) {
    case "RESET": {
      return { borrow: 0n, collateral: 0n, leverage: defaultMinLeverage };
    }
    case "SET_BORROW": {
      return { ...state, borrow: action.borrow };
    }
    case "SET_COLLATERAL": {
      return { ...state, collateral: action.collateral };
    }
    case "SET_LEVERAGE": {
      return { ...state, leverage: action.leverage };
    }
    default: {
      return state;
    }
  }
}

export function ceilDiv(a: bigint, b: bigint) {
  return (a + b - 1n) / b;
}

export function computeBorrow(collateral: bigint, leverage: number) {
  return (collateral * BigInt(leverage)) / BigInt(LEVERAGE_RATE);
}

export function convertDecimals(amount: bigint, from: number, to: number) {
  if (from === to) return amount;
  if (from > to) return amount / 10n ** BigInt(from - to);
  return amount * 10n ** BigInt(to - from);
}

export function getLeverageBounds(params: {
  collateralAssetAddress: string;
  maxLeverage?: number;
  minLeverage?: number;
  selectedAssetAddress: string;
}) {
  const leverageMaxWithDefault = params.maxLeverage || defaultMaxLeverage;
  const leverageMinWithDefault = params.minLeverage || defaultMinLeverage;

  const isSameAsset = params.collateralAssetAddress === params.selectedAssetAddress;

  const leverageMax = isSameAsset
    ? leverageMaxWithDefault
    : leverageMaxWithDefault - leverageAdjustmentForPt;

  const leverageMin = isSameAsset
    ? leverageMinWithDefault
    : leverageMinWithDefault + leverageAdjustmentForPt;

  return { leverageMax, leverageMin };
}

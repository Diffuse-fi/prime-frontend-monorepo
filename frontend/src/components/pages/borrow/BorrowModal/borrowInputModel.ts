import { ceilDiv, convertDecimals, LEVERAGE_RATE } from "./borrowReducer";

export type BorrowInputResolution =
  | {
      borrow: bigint;
      kind: "SET_BORROW_ONLY";
    }
  | {
      collateral: bigint;
      kind: "SET_LEVERAGE_AND_COLLATERAL";
      leverage: number;
    }
  | {
      kind: "SET_LEVERAGE_ONLY";
      leverage: number;
    };

export type ResolveBorrowInputParams = {
  collateralAmount: bigint;
  collateralAssetDecimals: number;
  collateralInSelectedAssetForBorrow: bigint | null;
  isStrategyCollateral: boolean;
  leverageMax: number;
  leverageMin: number;
  leverageStep?: number;
  nextBorrow: bigint;
  selectedAssetDecimals: number;
};

export function resolveBorrowInputChange(
  params: ResolveBorrowInputParams
): BorrowInputResolution {
  const {
    collateralAmount,
    collateralAssetDecimals,
    collateralInSelectedAssetForBorrow,
    isStrategyCollateral,
    leverageMax,
    leverageMin,
    leverageStep = 10,
    nextBorrow,
    selectedAssetDecimals,
  } = params;

  if (
    nextBorrow === 0n ||
    collateralAmount === 0n ||
    collateralInSelectedAssetForBorrow === null ||
    collateralInSelectedAssetForBorrow === 0n
  ) {
    return {
      borrow: nextBorrow,
      kind: "SET_BORROW_ONLY",
    };
  }

  const impliedLeverage = Number(
    (nextBorrow * BigInt(LEVERAGE_RATE)) / collateralInSelectedAssetForBorrow
  );

  const steppedLeverage = Math.round(impliedLeverage / leverageStep) * leverageStep;
  const clampedLeverage = Math.min(leverageMax, Math.max(leverageMin, steppedLeverage));

  const isOutOfRange = impliedLeverage < leverageMin || impliedLeverage > leverageMax;

  if (!isOutOfRange) {
    return {
      kind: "SET_LEVERAGE_ONLY",
      leverage: clampedLeverage,
    };
  }

  const targetCollateralInSelectedAsset = ceilDiv(
    nextBorrow * BigInt(LEVERAGE_RATE),
    BigInt(clampedLeverage)
  );

  const nextCollateralRaw = isStrategyCollateral
    ? ceilDiv(
        targetCollateralInSelectedAsset * collateralAmount,
        collateralInSelectedAssetForBorrow
      )
    : convertDecimals(
        targetCollateralInSelectedAsset,
        selectedAssetDecimals,
        collateralAssetDecimals
      );

  return {
    collateral: nextCollateralRaw,
    kind: "SET_LEVERAGE_AND_COLLATERAL",
    leverage: clampedLeverage,
  };
}

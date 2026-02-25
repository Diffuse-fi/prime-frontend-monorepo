import { describe, expect, it } from "vitest";

import { resolveBorrowInputChange } from "./borrowInputModel";

describe("resolveBorrowInputChange", () => {
  it("returns SET_BORROW_ONLY for zero borrow", () => {
    const result = resolveBorrowInputChange({
      collateralAmount: 100n,
      collateralAssetDecimals: 18,
      collateralInSelectedAssetForBorrow: 100n,
      isStrategyCollateral: false,
      leverageMax: 1000,
      leverageMin: 100,
      nextBorrow: 0n,
      selectedAssetDecimals: 18,
    });

    expect(result).toEqual({
      borrow: 0n,
      kind: "SET_BORROW_ONLY",
    });
  });

  it("returns SET_BORROW_ONLY when collateral conversion is unavailable", () => {
    const result = resolveBorrowInputChange({
      collateralAmount: 100n,
      collateralAssetDecimals: 18,
      collateralInSelectedAssetForBorrow: null,
      isStrategyCollateral: false,
      leverageMax: 1000,
      leverageMin: 100,
      nextBorrow: 100n,
      selectedAssetDecimals: 18,
    });

    expect(result).toEqual({
      borrow: 100n,
      kind: "SET_BORROW_ONLY",
    });
  });

  it("returns SET_LEVERAGE_ONLY when implied leverage is within range", () => {
    const result = resolveBorrowInputChange({
      collateralAmount: 100n,
      collateralAssetDecimals: 18,
      collateralInSelectedAssetForBorrow: 100n,
      isStrategyCollateral: false,
      leverageMax: 1000,
      leverageMin: 100,
      nextBorrow: 255n,
      selectedAssetDecimals: 18,
    });

    expect(result).toEqual({
      kind: "SET_LEVERAGE_ONLY",
      leverage: 260,
    });
  });

  it("clamps to min leverage and adjusts collateral when implied leverage is below range", () => {
    const result = resolveBorrowInputChange({
      collateralAmount: 100n,
      collateralAssetDecimals: 18,
      collateralInSelectedAssetForBorrow: 100n,
      isStrategyCollateral: false,
      leverageMax: 300,
      leverageMin: 100,
      nextBorrow: 50n,
      selectedAssetDecimals: 18,
    });

    expect(result).toEqual({
      collateral: 50n,
      kind: "SET_LEVERAGE_AND_COLLATERAL",
      leverage: 100,
    });
  });

  it("clamps to max leverage and adjusts collateral when implied leverage is above range", () => {
    const result = resolveBorrowInputChange({
      collateralAmount: 100n,
      collateralAssetDecimals: 18,
      collateralInSelectedAssetForBorrow: 100n,
      isStrategyCollateral: false,
      leverageMax: 300,
      leverageMin: 100,
      nextBorrow: 500n,
      selectedAssetDecimals: 18,
    });

    expect(result).toEqual({
      collateral: 167n,
      kind: "SET_LEVERAGE_AND_COLLATERAL",
      leverage: 300,
    });
  });

  it("adjusts collateral using current ratio for strategy collateral", () => {
    const result = resolveBorrowInputChange({
      collateralAmount: 200n,
      collateralAssetDecimals: 18,
      collateralInSelectedAssetForBorrow: 100n,
      isStrategyCollateral: true,
      leverageMax: 300,
      leverageMin: 100,
      nextBorrow: 400n,
      selectedAssetDecimals: 18,
    });

    expect(result).toEqual({
      collateral: 268n,
      kind: "SET_LEVERAGE_AND_COLLATERAL",
      leverage: 300,
    });
  });

  it("converts decimals for non-strategy collateral when adjusting collateral", () => {
    const result = resolveBorrowInputChange({
      collateralAmount: 1_000_000n,
      collateralAssetDecimals: 18,
      collateralInSelectedAssetForBorrow: 1_000_000n,
      isStrategyCollateral: false,
      leverageMax: 200,
      leverageMin: 100,
      nextBorrow: 5_000_000n,
      selectedAssetDecimals: 6,
    });

    expect(result).toEqual({
      collateral: 2_500_000n * 1_000_000_000_000n,
      kind: "SET_LEVERAGE_AND_COLLATERAL",
      leverage: 200,
    });
  });
});

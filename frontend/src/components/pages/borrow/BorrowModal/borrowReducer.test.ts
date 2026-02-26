import { describe, expect, it } from "vitest";

import {
  borrowReducer,
  type BorrowState,
  ceilDiv,
  computeBorrow,
  convertDecimals,
  defaultMaxLeverage,
  defaultMinLeverage,
  getLeverageBounds,
  LEVERAGE_RATE,
  leverageAdjustmentForPt,
} from "./borrowReducer";

describe("borrowReducer", () => {
  const initialState: BorrowState = {
    borrow: 1000n,
    collateral: 500n,
    leverage: 250,
  };

  it("resets state on RESET", () => {
    const next = borrowReducer(initialState, { type: "RESET" });

    expect(next).toEqual({
      borrow: 0n,
      collateral: 0n,
      leverage: defaultMinLeverage,
    });
  });

  it("sets borrow on SET_BORROW", () => {
    const next = borrowReducer(initialState, {
      borrow: 777n,
      borrowDecimals: 18,
      collateralDecimals: 18,
      type: "SET_BORROW",
    });

    expect(next).toEqual({
      ...initialState,
      borrow: 777n,
    });
  });

  it("sets collateral on SET_COLLATERAL", () => {
    const next = borrowReducer(initialState, {
      borrowDecimals: 18,
      collateral: 333n,
      collateralDecimals: 6,
      type: "SET_COLLATERAL",
    });

    expect(next).toEqual({
      ...initialState,
      collateral: 333n,
    });
  });

  it("sets leverage on SET_LEVERAGE", () => {
    const next = borrowReducer(initialState, {
      borrowDecimals: 18,
      collateralDecimals: 18,
      leverage: 420,
      type: "SET_LEVERAGE",
    });

    expect(next).toEqual({
      ...initialState,
      leverage: 420,
    });
  });

  it("returns current state for unknown action (runtime safety)", () => {
    const next = borrowReducer(initialState, {
      type: "UNKNOWN_ACTION",
    } as never);

    expect(next).toBe(initialState);
  });
});

describe("computeBorrow", () => {
  it("computes borrow using leverage rate units", () => {
    // leverage 250 = 2.50x
    const result = computeBorrow(1000n, 250);

    expect(result).toBe((1000n * 250n) / BigInt(LEVERAGE_RATE));
    expect(result).toBe(2500n);
  });

  it("returns 0 when collateral is 0", () => {
    expect(computeBorrow(0n, 500)).toBe(0n);
  });
});

describe("convertDecimals", () => {
  it("returns same amount when decimals are equal", () => {
    expect(convertDecimals(123_456n, 18, 18)).toBe(123_456n);
  });

  it("downscales when from > to", () => {
    expect(convertDecimals(1_500_000n, 6, 0)).toBe(1n);
  });

  it("upscales when from < to", () => {
    expect(convertDecimals(15n, 2, 4)).toBe(1500n);
  });

  it("handles large decimal differences", () => {
    expect(convertDecimals(1n, 6, 18)).toBe(1_000_000_000_000n);
  });
});

describe("ceilDiv", () => {
  it("returns exact division result when divisible", () => {
    expect(ceilDiv(10n, 5n)).toBe(2n);
  });

  it("rounds up when not divisible", () => {
    expect(ceilDiv(11n, 5n)).toBe(3n);
    expect(ceilDiv(1n, 10n)).toBe(1n);
  });
});

describe("getLeverageBounds", () => {
  it("uses default bounds for same collateral/selected asset", () => {
    const { leverageMax, leverageMin } = getLeverageBounds({
      collateralAssetAddress: "0xaaa",
      selectedAssetAddress: "0xaaa",
    });

    expect(leverageMin).toBe(defaultMinLeverage);
    expect(leverageMax).toBe(defaultMaxLeverage);
  });

  it("adjusts bounds for PT/alternate collateral", () => {
    const { leverageMax, leverageMin } = getLeverageBounds({
      collateralAssetAddress: "0xbbb",
      selectedAssetAddress: "0xaaa",
    });

    expect(leverageMin).toBe(defaultMinLeverage + leverageAdjustmentForPt);
    expect(leverageMax).toBe(defaultMaxLeverage - leverageAdjustmentForPt);
  });

  it("uses provided custom min/max before PT adjustment", () => {
    const { leverageMax, leverageMin } = getLeverageBounds({
      collateralAssetAddress: "0xbbb",
      maxLeverage: 800,
      minLeverage: 200,
      selectedAssetAddress: "0xaaa",
    });

    expect(leverageMin).toBe(200 + leverageAdjustmentForPt);
    expect(leverageMax).toBe(800 - leverageAdjustmentForPt);
  });

  it("uses provided custom min/max as-is for same asset", () => {
    const { leverageMax, leverageMin } = getLeverageBounds({
      collateralAssetAddress: "0xaaa",
      maxLeverage: 650,
      minLeverage: 150,
      selectedAssetAddress: "0xaaa",
    });

    expect(leverageMin).toBe(150);
    expect(leverageMax).toBe(650);
  });
});

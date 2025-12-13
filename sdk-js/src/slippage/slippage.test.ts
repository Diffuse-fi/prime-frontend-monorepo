import { describe, expect, it } from "vitest";

import {
  applySlippageBps,
  applySlippageBpsArray,
  SLIPPAGE_DENOMINATOR,
} from "./slippage";

describe("applySlippageBps", () => {
  it("returns the same amount when bps is 0 (down)", () => {
    const amount = 1000n;
    const bps: bigint = 0n;

    const result = applySlippageBps(amount, bps, "down");

    expect(result).toBe(1000n);
  });

  it("returns the same amount when bps is 0 (up)", () => {
    const amount = 1000n;
    const bps: bigint = 0n;

    const result = applySlippageBps(amount, bps, "up");

    expect(result).toBe(1000n);
  });

  it("applies downward slippage correctly (1%)", () => {
    const amount = 1000n;
    const bps: bigint = 100n;

    const result = applySlippageBps(amount, bps, "down");

    expect(result).toBe(990n);
  });

  it("applies upward slippage correctly (1%)", () => {
    const amount = 1000n;
    const bps: bigint = 100n;

    const result = applySlippageBps(amount, bps, "up");

    expect(result).toBe(1010n);
  });

  it("handles maximum bps (100%) for downward slippage", () => {
    const amount = 1000n;
    const bps: bigint = SLIPPAGE_DENOMINATOR;

    const result = applySlippageBps(amount, bps, "down");

    expect(result).toBe(0n);
  });

  it("handles maximum bps (100%) for upward slippage", () => {
    const amount = 1000n;
    const bps: bigint = SLIPPAGE_DENOMINATOR;

    const result = applySlippageBps(amount, bps, "up");

    expect(result).toBe(2000n);
  });

  it("returns 0 when amount is 0 regardless of bps and direction", () => {
    const amount = 0n;
    const bps: bigint = 500n;

    const down = applySlippageBps(amount, bps, "down");
    const up = applySlippageBps(amount, bps, "up");

    expect(down).toBe(0n);
    expect(up).toBe(0n);
  });

  it("throws when bps is negative", () => {
    const amount = 1000n;
    const bps = -1n as bigint;

    expect(() => applySlippageBps(amount, bps, "down")).toThrow(/Invalid slippage bps/);
  });

  it("throws when bps is greater than denominator", () => {
    const amount = 1000n;
    const bps = (SLIPPAGE_DENOMINATOR + 1n) as bigint;

    expect(() => applySlippageBps(amount, bps, "down")).toThrow(/Invalid slippage bps/);
  });

  it("uses 'down' as default direction", () => {
    const amount = 1000n;
    const bps: bigint = 100n;

    const result = applySlippageBps(amount, bps);

    expect(result).toBe(990n);
  });

  it("rounds down on integer division", () => {
    const amount = 1001n;
    const bps: bigint = 333n;

    const result = applySlippageBps(amount, bps, "down");

    const expected = (amount * (SLIPPAGE_DENOMINATOR - bps)) / SLIPPAGE_DENOMINATOR;

    expect(result).toBe(expected);
    expect(result).toBeLessThan(amount);
    expect(result).toBeGreaterThanOrEqual(0n);
  });
});

describe("applySlippageBpsArray", () => {
  it("applies slippage to each element (down)", () => {
    const amounts = [1000n, 2000n, 3000n] as const;
    const bps: bigint = 100n;

    const result = applySlippageBpsArray(amounts, bps, "down");

    expect(result).toEqual([990n, 1980n, 2970n]);
  });

  it("applies slippage to each element (up)", () => {
    const amounts = [1000n, 2000n, 3000n] as const;
    const bps: bigint = 100n;

    const result = applySlippageBpsArray(amounts, bps, "up");

    expect(result).toEqual([1010n, 2020n, 3030n]);
  });

  it("returns an empty array when input is empty", () => {
    const amounts: bigint[] = [];
    const bps: bigint = 100n;

    const result = applySlippageBpsArray(amounts, bps, "down");

    expect(result).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const amounts = [1000n, 2000n] as const;
    const copy = [...amounts];
    const bps: bigint = 50n;

    applySlippageBpsArray(amounts, bps, "down");

    expect(amounts).toEqual(copy);
  });

  it("uses 'down' as default direction", () => {
    const amounts = [1000n, 2000n] as const;
    const bps: bigint = 100n;

    const result = applySlippageBpsArray(amounts, bps);

    expect(result).toEqual([990n, 1980n]);
  });
});

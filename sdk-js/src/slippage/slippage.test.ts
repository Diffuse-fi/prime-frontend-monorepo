import { describe, it, expect } from "vitest";
import {
  SLIPPAGE_DENOMINATOR,
  applySlippageBps,
  applySlippageBpsArray,
  type SlippageBps,
} from "./slippage";

describe("applySlippageBps", () => {
  it("returns the same amount when bps is 0 (down)", () => {
    const amount = 1_000n;
    const bps: SlippageBps = 0n;

    const result = applySlippageBps(amount, bps, "down");

    expect(result).toBe(1_000n);
  });

  it("returns the same amount when bps is 0 (up)", () => {
    const amount = 1_000n;
    const bps: SlippageBps = 0n;

    const result = applySlippageBps(amount, bps, "up");

    expect(result).toBe(1_000n);
  });

  it("applies downward slippage correctly (1%)", () => {
    const amount = 1_000n;
    const bps: SlippageBps = 100n;

    const result = applySlippageBps(amount, bps, "down");

    expect(result).toBe(990n);
  });

  it("applies upward slippage correctly (1%)", () => {
    const amount = 1_000n;
    const bps: SlippageBps = 100n;

    const result = applySlippageBps(amount, bps, "up");

    expect(result).toBe(1_010n);
  });

  it("handles maximum bps (100%) for downward slippage", () => {
    const amount = 1_000n;
    const bps: SlippageBps = SLIPPAGE_DENOMINATOR;

    const result = applySlippageBps(amount, bps, "down");

    expect(result).toBe(0n);
  });

  it("handles maximum bps (100%) for upward slippage", () => {
    const amount = 1_000n;
    const bps: SlippageBps = SLIPPAGE_DENOMINATOR;

    const result = applySlippageBps(amount, bps, "up");

    expect(result).toBe(2_000n);
  });

  it("returns 0 when amount is 0 regardless of bps and direction", () => {
    const amount = 0n;
    const bps: SlippageBps = 500n;

    const down = applySlippageBps(amount, bps, "down");
    const up = applySlippageBps(amount, bps, "up");

    expect(down).toBe(0n);
    expect(up).toBe(0n);
  });

  it("throws when bps is negative", () => {
    const amount = 1_000n;
    const bps = -1n as SlippageBps;

    expect(() => applySlippageBps(amount, bps, "down")).toThrow(/Invalid slippage bps/);
  });

  it("throws when bps is greater than denominator", () => {
    const amount = 1_000n;
    const bps = (SLIPPAGE_DENOMINATOR + 1n) as SlippageBps;

    expect(() => applySlippageBps(amount, bps, "down")).toThrow(/Invalid slippage bps/);
  });

  it("uses 'down' as default direction", () => {
    const amount = 1_000n;
    const bps: SlippageBps = 100n;

    const result = applySlippageBps(amount, bps);

    expect(result).toBe(990n);
  });

  it("rounds down on integer division", () => {
    const amount = 1_001n;
    const bps: SlippageBps = 333n;

    const result = applySlippageBps(amount, bps, "down");

    const expected = (amount * (SLIPPAGE_DENOMINATOR - bps)) / SLIPPAGE_DENOMINATOR;

    expect(result).toBe(expected);
    expect(result).toBeLessThan(amount);
    expect(result).toBeGreaterThanOrEqual(0n);
  });
});

describe("applySlippageBpsArray", () => {
  it("applies slippage to each element (down)", () => {
    const amounts = [1_000n, 2_000n, 3_000n] as const;
    const bps: SlippageBps = 100n;

    const result = applySlippageBpsArray(amounts, bps, "down");

    expect(result).toEqual([990n, 1_980n, 2_970n]);
  });

  it("applies slippage to each element (up)", () => {
    const amounts = [1_000n, 2_000n, 3_000n] as const;
    const bps: SlippageBps = 100n;

    const result = applySlippageBpsArray(amounts, bps, "up");

    expect(result).toEqual([1_010n, 2_020n, 3_030n]);
  });

  it("returns an empty array when input is empty", () => {
    const amounts: bigint[] = [];
    const bps: SlippageBps = 100n;

    const result = applySlippageBpsArray(amounts, bps, "down");

    expect(result).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const amounts = [1_000n, 2_000n] as const;
    const copy = [...amounts];
    const bps: SlippageBps = 50n;

    applySlippageBpsArray(amounts, bps, "down");

    expect(amounts).toEqual(copy);
  });

  it("uses 'down' as default direction", () => {
    const amounts = [1_000n, 2_000n] as const;
    const bps: SlippageBps = 100n;

    const result = applySlippageBpsArray(amounts, bps);

    expect(result).toEqual([990n, 1_980n]);
  });
});

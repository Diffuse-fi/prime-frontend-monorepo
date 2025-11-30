import { describe, it, expect } from "vitest";
import { getStartBlockForChainId, type StartBlocksConfig } from "./utils";
import { DEFAULT_START_BLOCK } from "./const";

describe("getStartBlockForChainId", () => {
  it("returns DEFAULT_START_BLOCK when startBlocks is undefined", () => {
    const result = getStartBlockForChainId(1, undefined);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });

  it("returns DEFAULT_START_BLOCK when startBlocks is an empty object", () => {
    const startBlocks: StartBlocksConfig = {};
    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });

  it("returns bigint value when configured as bigint", () => {
    const custom = 123456789n;
    const startBlocks: StartBlocksConfig = {
      1: custom,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(custom);
  });

  it("returns BigInt of number value when configured as a valid non-negative integer", () => {
    const startBlocks: StartBlocksConfig = {
      1: 123456,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(123456n);
  });

  it("treats 0 as a valid block number", () => {
    const startBlocks: StartBlocksConfig = {
      1: 0,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(0n);
  });

  it("returns DEFAULT_START_BLOCK for negative numbers", () => {
    const startBlocks: StartBlocksConfig = {
      1: -1,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });

  it("returns DEFAULT_START_BLOCK for non-integer numbers", () => {
    const startBlocks: StartBlocksConfig = {
      1: 123.45,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });

  it("returns DEFAULT_START_BLOCK for NaN", () => {
    const startBlocks: StartBlocksConfig = {
      1: Number.NaN,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });

  it("returns DEFAULT_START_BLOCK for Infinity", () => {
    const startBlocks: StartBlocksConfig = {
      1: Number.POSITIVE_INFINITY,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });

  it("returns DEFAULT_START_BLOCK when chainId is not present in startBlocks", () => {
    const startBlocks: StartBlocksConfig = {
      2: 1000,
    };

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });

  it("returns DEFAULT_START_BLOCK for values of unsupported types", () => {
    const startBlocks = {
      1: "1000" as unknown as bigint | number,
    } as StartBlocksConfig;

    const result = getStartBlockForChainId(1, startBlocks);
    expect(result).toBe(DEFAULT_START_BLOCK);
  });
});

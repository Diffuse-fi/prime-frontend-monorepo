import { DEFAULT_START_BLOCK } from "./const";

export type StartBlocksConfig = Partial<Record<number, bigint | number>> | undefined;

export function getStartBlockForChainId(
  chainId: number,
  startBlocks: StartBlocksConfig
): bigint {
  if (!startBlocks) {
    return DEFAULT_START_BLOCK;
  }

  const raw = startBlocks[chainId];

  if (typeof raw === "bigint") {
    return raw;
  }

  if (typeof raw === "number") {
    if (!Number.isFinite(raw) || !Number.isInteger(raw) || raw < 0) {
      return DEFAULT_START_BLOCK;
    }

    return BigInt(raw);
  }

  return DEFAULT_START_BLOCK;
}

export const SLIPPAGE_DENOMINATOR = 10_000n as const;

export function applySlippageBps(
  amount: bigint,
  bps: bigint,
  direction: "down" | "up" = "down"
): bigint {
  if (bps < 0n || bps > SLIPPAGE_DENOMINATOR) {
    throw new Error(`Invalid slippage bps: ${bps.toString()}`);
  }

  if (amount === 0n) return 0n;

  if (direction === "down") {
    const num = SLIPPAGE_DENOMINATOR - bps;
    return (amount * num) / SLIPPAGE_DENOMINATOR;
  }

  const num = SLIPPAGE_DENOMINATOR + bps;
  return (amount * num) / SLIPPAGE_DENOMINATOR;
}

export function applySlippageBpsArray(
  amounts: readonly bigint[],
  bps: bigint,
  direction: "down" | "up" = "down"
): bigint[] {
  return amounts.map(x => applySlippageBps(x, bps, direction));
}

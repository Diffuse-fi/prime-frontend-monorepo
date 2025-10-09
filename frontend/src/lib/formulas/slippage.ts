const DEN = 10_000n as const;

const SLIPPAGE_BPS: Record<string, bigint> = {
  "0.1": 10n,
  "0.5": 50n,
  "1.0": 100n,
};

export function getSlippageBps(slippageKey: string): bigint {
  return SLIPPAGE_BPS[slippageKey] ?? 0n;
}

export function applySlippage(amount: bigint, slippageKey: string): bigint {
  const bps = SLIPPAGE_BPS[slippageKey] ?? 0n;
  const num = DEN - bps;
  return (amount * num) / DEN;
}

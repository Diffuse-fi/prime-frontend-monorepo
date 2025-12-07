const SLIPPAGE_BPS_BY_KEY: Record<string, bigint> = {
  "0.1": 10n,
  "0.5": 50n,
  "1.0": 100n,
};

export function getSlippageBpsFromKey(slippageKey: string): bigint {
  return SLIPPAGE_BPS_BY_KEY[slippageKey] ?? 0n;
}

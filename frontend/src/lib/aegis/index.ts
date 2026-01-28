import { Strategy } from "../core/types";

const AEGIS_STRATEGY_KEYWORDS = ["aegis", "yUSD", "jUSD"].map(k => k.toLowerCase());

export function isAegisStrategy(strategy: Strategy) {
  const nameLower = strategy.name.toLowerCase();
  const nameMatch = AEGIS_STRATEGY_KEYWORDS.some(keyword => nameLower.includes(keyword));

  return nameMatch;
}

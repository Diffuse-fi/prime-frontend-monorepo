import type { FormatResult } from "./types";
import { formatThousandsSpace } from "./number";

export function formatTokenAmount(
  amount: string,
  decimals: number,
  symbol: string,
  delimiter = "."
): FormatResult<string> {
  const factor = 10 ** decimals;
  const num = Number(amount) / factor;

  return {
    text: `${num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    })} ${symbol}`,
    value: amount,
    meta: {
      decimals,
      symbol,
    },
  };
}

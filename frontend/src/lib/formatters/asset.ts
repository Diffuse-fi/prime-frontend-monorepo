import type { FormatResult } from "./types";
import { Address, formatUnits as formatUnitsViem } from "viem";
import { formatThousandsSpace } from "./number";
import truncateEthAddress from "truncate-eth-address";

export function formatAsset(
  amount: bigint,
  decimals: number,
  symbol: string
): FormatResult<string> {
  const formatted = formatUnitsViem(amount, decimals);

  return {
    text: `${
      formatThousandsSpace(Number(formatted), {
        maximumFractionDigits: 2,
      }).text
    } ${symbol}`,
    value: formatted,
    meta: { amount, decimals, symbol },
  };
}

export function formatUnits(
  ...params: Parameters<typeof formatUnitsViem>
): FormatResult<bigint> {
  const res = formatUnitsViem(...params);

  return {
    text: formatThousandsSpace(Number(res), {
      maximumFractionDigits: Math.min(params[1], 6) ?? 2,
    }).text,
    value: params[0],
    meta: { amount: params[0], decimals: params[1] },
  };
}

export function formatEvmAddress(address: Address): string {
  return truncateEthAddress(address);
}

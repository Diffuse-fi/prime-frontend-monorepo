import type { FormatResult } from "./types";

import truncateEthAddress from "truncate-eth-address";
import { Address, formatUnits as formatUnitsViem } from "viem";

import { formatThousandsSpace } from "./number";

export function formatAsset(
  amount: bigint,
  decimals: number,
  symbol: string
): FormatResult<string> {
  const formatted = formatUnitsViem(amount, decimals);

  return {
    meta: { amount, decimals, symbol },
    text: `${
      formatThousandsSpace(Number(formatted), {
        maximumFractionDigits: 2,
      }).text
    } ${symbol}`,
    value: formatted,
  };
}

export function formatEvmAddress(address: Address): string {
  return truncateEthAddress(address);
}

export function formatUnits(
  ...params: Parameters<typeof formatUnitsViem>
): FormatResult<bigint> {
  const res = formatUnitsViem(...params);

  return {
    meta: { amount: params[0], decimals: params[1], rawViem: res },
    text: formatThousandsSpace(Number(res), {
      maximumFractionDigits: Math.min(params[1], 6) ?? 2,
    }).text,
    value: params[0],
  };
}

export function getPartialAllowanceText(
  allowed: bigint,
  required: bigint,
  decimals: number,
  symbol: string
): string {
  const allowedFormatted = formatUnits(allowed, decimals).text;
  const requiredFormatted = formatUnits(required, decimals).text;

  return `${allowedFormatted} out of ${requiredFormatted} ${symbol} approved`;
}

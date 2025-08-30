import type { FormatResult } from "./types";

export function formatAprPercent(raw: bigint, fractionDigits = 2): FormatResult<bigint> {
  const percent = Number(raw) / 100;
  const res = percent.toFixed(fractionDigits) + "%";

  return { value: raw, text: res, tooltip: res };
}

export function formatAprFraction(raw: bigint): FormatResult<bigint> {
  const res = (Number(raw) / 10_000).toString();

  return { value: raw, text: res, tooltip: res };
}

import { FORMAT_DEFAULTS, SCALES } from "./config";
import type { FormatResult } from "./types";

export function formatAprPercent(
  raw: bigint,
  fractionDigits = FORMAT_DEFAULTS.fractionDigits
): FormatResult<bigint> {
  const percent = raw / SCALES.PERCENT;
  const res = Number(percent).toFixed(fractionDigits) + "%";

  return { value: raw, text: res, tooltip: res };
}

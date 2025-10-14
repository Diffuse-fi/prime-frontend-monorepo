import { FORMAT_DEFAULTS, SCALES } from "./config";
import type { FormatResult } from "./types";

export function formatAprToPercent<T extends bigint | number>(
  raw: T,
  fractionDigits: number = FORMAT_DEFAULTS.fractionDigits
): FormatResult<T> {
  const percent = Number(raw) / Number(SCALES.PERCENT);
  const res = Number(percent).toFixed(fractionDigits) + "%";

  return { value: raw, text: res, tooltip: res };
}

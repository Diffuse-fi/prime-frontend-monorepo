import type { FormatResult } from "./types";

import { FORMAT_DEFAULTS, SCALES } from "./config";

export function formatAprToPercent<T extends bigint | number>(
  raw: T,
  fractionDigits: number = FORMAT_DEFAULTS.fractionDigits
): FormatResult<T> {
  const percent = Number(raw) / Number(SCALES.PERCENT);
  const res = Number(percent).toFixed(fractionDigits) + "%";

  return { text: res, tooltip: res, value: raw };
}

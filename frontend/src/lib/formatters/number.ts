import type { FormatResult } from "./types";

const THIN_NBSP = "\u202F";

export function formatThousandsSpace(
  n: number | bigint,
  opts: Intl.NumberFormatOptions = {}
): FormatResult<number | bigint> {
  // We want to have a unified format so we ignore locale and always use en-US
  const nf = new Intl.NumberFormat("en-US", { useGrouping: true, ...opts });
  const res = nf
    .formatToParts(n)
    .map(p => (p.type === "group" ? THIN_NBSP : p.value))
    .join("");

  return {
    text: res,
    value: n,
    meta: {
      formatter: Intl.NumberFormat,
      options: opts,
    },
  };
}

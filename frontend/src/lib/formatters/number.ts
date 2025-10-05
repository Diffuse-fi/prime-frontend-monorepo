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

export function formatNumberToKMB<T extends number | bigint>(
  n: T,
  opts?: {
    maxFractionCompact?: number;
    smallNumberFraction?: number;
  }
): FormatResult<T> {
  const maxFractionCompact = opts?.maxFractionCompact ?? 3;
  const smallNumberFraction = opts?.smallNumberFraction ?? 2;

  const isBig = typeof n === "bigint";
  const absBig = isBig ? (n >= 0n ? (n as bigint) : -(n as bigint)) : null;
  const absNum = !isBig ? Math.abs(n as number) : null;

  type Suf = {
    suffix: "K" | "M" | "B";
    div: bigint;
    divNum: number;
    threshold: bigint | number;
  };
  const table: Suf[] = [
    {
      suffix: "B",
      div: 1_000_000_000n,
      divNum: 1_000_000_000,
      threshold: isBig ? 1_000_000_000n : 1_000_000_000,
    },
    {
      suffix: "M",
      div: 1_000_000n,
      divNum: 1_000_000,
      threshold: isBig ? 1_000_000n : 1_000_000,
    },
    { suffix: "K", div: 1_000n, divNum: 1_000, threshold: isBig ? 1_000n : 1_000 },
  ];

  const pick = () => {
    if (isBig) {
      if ((absBig as bigint) >= table[0].threshold) return table[0];
      if ((absBig as bigint) >= table[1].threshold) return table[1];
      if ((absBig as bigint) >= table[2].threshold) return table[2];
      return null;
    } else {
      if (((absNum as number) >= table[0].threshold) as unknown as number)
        return table[0];
      if (((absNum as number) >= table[1].threshold) as unknown as number)
        return table[1];
      if (((absNum as number) >= table[2].threshold) as unknown as number)
        return table[2];
      return null;
    }
  };

  const chosen = pick();

  const toFixedBig = (value: bigint, divisor: bigint, frac: number) => {
    const sign = value < 0n ? "-" : "";
    const v = value < 0n ? -value : value;
    const intPart = v / divisor;
    const rem = v % divisor;
    if (frac === 0) return `${sign}${intPart.toString()}`;
    let scale = 1n;
    for (let i = 0; i < frac; i++) scale *= 10n;
    const dec = (rem * scale) / divisor;
    let decStr = dec.toString();
    decStr = decStr.replace(/0+$/, "");
    if (decStr.length === 0) return `${sign}${intPart.toString()}`;
    return `${sign}${intPart.toString()}.${decStr}`;
  };

  if (chosen) {
    const text = isBig
      ? toFixedBig(n as bigint, chosen.div, maxFractionCompact)
      : (() => {
          const v = (n as number) / chosen.divNum;
          const s = v.toFixed(maxFractionCompact);
          return s.replace(/\.?0+$/, "");
        })();

    return {
      text: `${text}${chosen.suffix}`,
      value: n,
      meta: { compact: true, suffix: chosen.suffix, maxFractionCompact },
    };
  }

  const formatted = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: smallNumberFraction,
    maximumFractionDigits: smallNumberFraction,
  }).format(Number(n));

  const withThinSpaces = formatted.replace(/,/g, THIN_NBSP);

  return {
    text: withThinSpaces,
    value: n,
    meta: { compact: false, suffix: null, maxFractionCompact },
  };
}

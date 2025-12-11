import type { FormatResult } from "./types";

const THIN_NBSP = "\u202F";

const stripTrailingFractionZeros = (str: string) => {
  const dotIndex = str.indexOf(".");
  if (dotIndex === -1) return str;
  let end = str.length;
  while (end > dotIndex && str.codePointAt(end - 1) === 48) {
    end -= 1;
  }
  if (end === dotIndex + 1) return str.slice(0, dotIndex);
  return str.slice(0, end);
};

const trimTrailingZeros = (str: string) => {
  let end = str.length;
  while (end > 0 && str.codePointAt(end - 1) === 48) {
    end -= 1;
  }
  return str.slice(0, end);
};

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
  decStr = trimTrailingZeros(decStr);
  if (decStr.length === 0) return `${sign}${intPart.toString()}`;
  return `${sign}${intPart.toString()}.${decStr}`;
};

export function formatNumberToKMB<T extends bigint | number>(
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
  const absNum = isBig ? null : Math.abs(n as number);

  type Suf = {
    div: bigint;
    divNum: number;
    suffix: "B" | "K" | "M";
    threshold: bigint | number;
  };
  const table: Suf[] = [
    {
      div: 1_000_000_000n,
      divNum: 1_000_000_000,
      suffix: "B",
      threshold: isBig ? 1_000_000_000n : 1_000_000_000,
    },
    {
      div: 1_000_000n,
      divNum: 1_000_000,
      suffix: "M",
      threshold: isBig ? 1_000_000n : 1_000_000,
    },
    { div: 1000n, divNum: 1000, suffix: "K", threshold: isBig ? 1000n : 1000 },
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

  if (chosen) {
    const text = isBig
      ? toFixedBig(n as bigint, chosen.div, maxFractionCompact)
      : (() => {
          const v = (n as number) / chosen.divNum;
          const s = v.toFixed(maxFractionCompact);
          return stripTrailingFractionZeros(s);
        })();

    return {
      meta: { compact: true, maxFractionCompact, suffix: chosen.suffix },
      text: `${text}${chosen.suffix}`,
      value: n,
    };
  }

  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: smallNumberFraction,
    minimumFractionDigits: smallNumberFraction,
    useGrouping: true,
  }).format(Number(n));

  const withThinSpaces = formatted.replaceAll(",", THIN_NBSP);

  return {
    meta: { compact: false, maxFractionCompact, suffix: null },
    text: withThinSpaces,
    value: n,
  };
}

export function formatThousandsSpace(
  n: bigint | number,
  opts: Intl.NumberFormatOptions = {}
): FormatResult<bigint | number> {
  // We want to have a unified format so we ignore locale and always use en-US
  const nf = new Intl.NumberFormat("en-US", { useGrouping: true, ...opts });
  const res = nf
    .formatToParts(n)
    .map(p => (p.type === "group" ? THIN_NBSP : p.value))
    .join("");

  return {
    meta: {
      formatter: Intl.NumberFormat,
      options: opts,
    },
    text: res,
    value: n,
  };
}

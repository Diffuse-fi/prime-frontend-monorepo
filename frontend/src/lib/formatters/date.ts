import type { DateFormatOpts, FormatResult } from "./types";

import dayjsBase from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjsBase.extend(utc);
dayjsBase.extend(timezone);
dayjsBase.extend(relativeTime);
dayjsBase.extend(duration);
dayjsBase.extend(customParseFormat);
dayjsBase.extend(advancedFormat);

export type Dateish = bigint | number | string;

export function normalizeTimestamp(ts: bigint | number): number {
  const n = typeof ts === "bigint" ? Number(ts) : ts;
  const isUnix = n < 1_000_000_000_000;
  return isUnix ? n * 1000 : n;
}

export const day = (ts?: Dateish, opts?: DateFormatOpts) => {
  const d =
    ts === undefined
      ? dayjsBase()
      : dayjsBase(
          typeof ts === "number" || typeof ts === "bigint" ? normalizeTimestamp(ts) : ts
        );
  const withLocale = opts?.locale ? d.locale(opts.locale) : d;
  const tz = opts?.tz;

  return tz ? withLocale.tz(tz) : withLocale;
};

export function compareDatish(ts1: Dateish, ts2: Dateish): number {
  const n1 = normalizeTimestamp(typeof ts1 === "bigint" ? ts1 : Number(ts1));
  const n2 = normalizeTimestamp(typeof ts2 === "bigint" ? ts2 : Number(ts2));

  const firstIsBigger = n1 > n2;
  return firstIsBigger ? 1 : n1 < n2 ? -1 : 0;
}

export function formatDate(ts: Dateish, opts?: DateFormatOpts): FormatResult<Date> {
  const d = day(ts, opts);

  return { text: d.format("MMM D, YYYY"), tooltip: d.toISOString(), value: d.toDate() };
}

export function formatDateTime(ts: Dateish, opts?: DateFormatOpts): FormatResult<Date> {
  const d = day(ts, opts);

  return {
    text: d.format("MMM D, YYYY HH:mm"),
    tooltip: d.toISOString(),
    value: d.toDate(),
  };
}

export function formatDuration(totalSeconds: number): FormatResult<number> {
  const dur = dayjsBase.duration(totalSeconds, "seconds");
  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const mins = dur.minutes();
  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins || parts.length === 0) parts.push(`${mins}m`);

  return { text: parts.join(" "), value: totalSeconds };
}

export function formatTimeAgo(ts: Dateish, opts?: DateFormatOpts): FormatResult<number> {
  const d = day(ts, opts);
  const now = day(undefined, opts);
  const text = d.isAfter(now) ? now.from(d) : d.from(now);

  return { text, tooltip: d.toISOString(), value: d.valueOf() };
}

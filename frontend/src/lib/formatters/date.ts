import type { DateFormatOpts, FormatResult } from "./types";
import dayjsBase from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjsBase.extend(utc);
dayjsBase.extend(timezone);
dayjsBase.extend(relativeTime);
dayjsBase.extend(duration);
dayjsBase.extend(customParseFormat);
dayjsBase.extend(advancedFormat);

export type Dateish = number | string | bigint;

function normalizeTimestamp(ts: number | bigint): number {
  const n = typeof ts === "bigint" ? Number(ts) : ts;
  const isUnix = n < 1_000_000_000_000;
  return isUnix ? n * 1000 : n;
}

const day = (ts?: Dateish, opts?: DateFormatOpts) => {
  const d =
    ts !== undefined
      ? dayjsBase(
          typeof ts === "number" || typeof ts === "bigint" ? normalizeTimestamp(ts) : ts
        )
      : dayjsBase();
  const withLocale = opts?.locale ? d.locale(opts.locale) : d;
  const tz = opts?.tz;

  return tz ? withLocale.tz(tz) : withLocale;
};

export function formatDate(ts: Dateish, opts?: DateFormatOpts): FormatResult<Date> {
  const d = day(ts, opts);

  return { value: d.toDate(), text: d.format("MMM D, YYYY"), tooltip: d.toISOString() };
}

export function formatDateTime(ts: Dateish, opts?: DateFormatOpts): FormatResult<Date> {
  const d = day(ts, opts);

  return {
    value: d.toDate(),
    text: d.format("MMM D, YYYY HH:mm"),
    tooltip: d.toISOString(),
  };
}

export function formatTimeAgo(ts: Dateish, opts?: DateFormatOpts): FormatResult<number> {
  const d = day(ts, opts);
  const now = day(undefined, opts);
  const text = d.isAfter(now) ? now.from(d) : d.from(now);

  return { value: d.valueOf(), text, tooltip: d.toISOString() };
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

  return { value: totalSeconds, text: parts.join(" ") };
}

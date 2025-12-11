import { Dateish, day } from "../formatters/date";
import { DateFormatOpts } from "../formatters/types";

type CalcDaysIntervalParams = {
  from?: Dateish;
  opts?: DateFormatOpts;
  to: Dateish;
};

export function calcDaysInterval({
  from,
  opts = {},
  to,
}: CalcDaysIntervalParams): number {
  const fromD = day(from ?? Date.now(), opts);
  const toD = day(to, opts);

  if (!fromD.isValid() || !toD.isValid()) {
    throw new Error("Invalid date");
  }

  return toD.diff(fromD, "day");
}

export function now(): number {
  return Date.now();
}

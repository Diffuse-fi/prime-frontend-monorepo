import { Dateish, day } from "../formatters/date";
import { DateFormatOpts } from "../formatters/types";

type CalcDaysIntervalParams = {
  to: Dateish;
  from?: Dateish;
  opts?: DateFormatOpts;
};

export function calcDaysInterval({
  to,
  from,
  opts = {},
}: CalcDaysIntervalParams): number {
  const fromD = day(from ?? Date.now(), opts);
  const toD = day(to, opts);

  if (!fromD.isValid() || !toD.isValid()) {
    throw new Error("Invalid date");
  }

  return toD.diff(fromD, "day");
}

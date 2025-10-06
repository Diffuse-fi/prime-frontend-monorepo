import { Dateish } from "../formatters/date";
import dayjsBase from "dayjs";

export function calcDaysInterval(to: Dateish, from?: Dateish): number {
  const fromD = dayjsBase(
    from === undefined
      ? dayjsBase()
      : typeof from === "number" || typeof from === "bigint"
        ? Number(from)
        : from
  );

  const toD = dayjsBase(
    typeof to === "number" || typeof to === "bigint" ? Number(to) : to
  );

  return toD.diff(fromD, "day");
}

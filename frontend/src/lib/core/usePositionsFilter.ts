import { useMemo } from "react";
import { useLocalStorage } from "../misc/useLocalStorage";
import { z } from "zod";
import { produce } from "immer";
import { LenderPosition } from "./types";

export type PositionStatus = "active" | "closed" | "all";

export type PositionsFilter = {
  status: PositionStatus;
};

const FilterSchema = z.object({
  status: z.enum(["active", "closed", "all"]),
});

const validateFilter = (data: unknown) => {
  return FilterSchema.safeParse(data).success;
};

export function usePositionsFilter(allPositions: LenderPosition[]) {
  const [filter, setFilter] = useLocalStorage<PositionsFilter>(
    "positions-filter",
    {
      status: "all",
    },
    validateFilter
  );

  const filteredPositions = useMemo(() => {
    return allPositions.filter(() => {
      if (filter.status === "all") return true;

      return true;
    });
  }, [allPositions, filter]);

  const setStatus = (status: PositionStatus) => {
    setFilter(
      produce(draft => {
        draft.status = status;
      })
    );
  };

  return { filter, filteredPositions, setStatus };
}

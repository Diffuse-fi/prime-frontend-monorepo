import { useMemo, useState } from "react";
import { useLocalStorage } from "../misc/useLocalStorage";
import { z } from "zod";

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

export function usePositionsFilter() {
  const [filter, setFilterState] = useLocalStorage<PositionsFilter>(
    "positions-filter",
    {
      status: "all",
    },
    validateFilter
  );

  const setFilter = (newFilter: Partial<PositionsFilter>) => {};

  return { filter };
}

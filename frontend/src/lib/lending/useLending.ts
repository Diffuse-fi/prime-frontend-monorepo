import { useMemo } from "react";
import { useLendingInit } from "./useLendingInit";
import { Lending } from "@defuse/sdk-js";

export function useLending() {
  const init = useLendingInit();

  const LendingContract = useMemo(() => {
    if (!init) {
      return null;
    }

    return new Lending(init);
  }, [init]);

  return LendingContract;
}

"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function usePrevValueLocalStorage<T>(value: T, defaultValue: T, lsKey: string) {
  const [val, setVal] = useLocalStorage<T>(lsKey, defaultValue);

  useEffect(() => {
    if (value !== val) {
      setVal(value);
    }
  }, [value, val, setVal]);

  return val;
}

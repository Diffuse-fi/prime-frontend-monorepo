"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: T) => boolean
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed: T = JSON.parse(item);
        if (!validate || validate(parsed)) {
          return parsed;
        }
      }
      return initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (!validate || validate(storedValue)) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue, validate, initialValue]);

  return [storedValue, setStoredValue] as const;
}

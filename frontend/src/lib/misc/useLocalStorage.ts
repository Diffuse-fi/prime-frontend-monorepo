"use client";

import { JSONParse, JSONStringify } from "json-with-bigint";
import { useCallback, useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: T) => boolean
) {
  const isServer = globalThis.window === undefined;
  const prevKeyRef = useRef(key);
  const initialRef = useRef(initialValue);

  const read = useCallback(
    (k: string): T => {
      if (isServer) return initialRef.current;

      try {
        const raw = globalThis.localStorage.getItem(k);
        if (raw != undefined) {
          const parsed = JSONParse(raw) as T;
          if (!validate || validate(parsed)) return parsed;
        }
      } catch (error) {
        console.error(error);
      }
      return initialRef.current;
    },
    [isServer, validate]
  );

  const [storedValue, setStoredValue] = useState<T>(() => read(key));

  useEffect(() => {
    if (prevKeyRef.current !== key) {
      if (!isServer) {
        try {
          globalThis.localStorage.removeItem(prevKeyRef.current);
        } catch (error) {
          console.error(error);
        }
      }

      setStoredValue(read(key));
      prevKeyRef.current = key;
    }
  }, [key, read, isServer]);

  useEffect(() => {
    if (isServer) return;

    try {
      const valueToStore =
        !validate || validate(storedValue) ? storedValue : initialRef.current;
      globalThis.localStorage.setItem(key, JSONStringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue, validate, isServer]);

  return [storedValue, setStoredValue] as const;
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { JSONParse, JSONStringify } from "json-with-bigint";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: T) => boolean
) {
  const isServer = typeof window === "undefined";
  const prevKeyRef = useRef(key);
  const initialRef = useRef(initialValue);

  const read = useCallback(
    (k: string): T => {
      if (isServer) return initialRef.current;

      try {
        const raw = window.localStorage.getItem(k);
        if (raw != null) {
          const parsed = JSONParse(raw) as T;
          if (!validate || validate(parsed)) return parsed;
        }
      } catch (e) {
        console.error(e);
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
          window.localStorage.removeItem(prevKeyRef.current);
        } catch (e) {
          console.error(e);
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
      window.localStorage.setItem(key, JSONStringify(valueToStore));
    } catch (e) {
      console.error(e);
    }
  }, [key, storedValue, validate, isServer]);

  return [storedValue, setStoredValue] as const;
}

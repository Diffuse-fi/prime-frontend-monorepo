import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = globalThis.setTimeout(() => setDebounced(value), delay);
    return () => globalThis.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

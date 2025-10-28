import { env } from "@/env";

export function isDebugMode() {
  return env.NEXT_PUBLIC_DEBUG === true;
}

export function debugLog(...args: unknown[]) {
  if (isDebugMode()) {
    console.log(...args);
  }
}

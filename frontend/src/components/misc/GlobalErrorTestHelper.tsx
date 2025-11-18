"use client";

import { useSearchParams } from "next/navigation";

export function GlobalErrorTestHelper() {
  const searchParams = useSearchParams();
  const forceError = searchParams.get("forceGlobalError");

  if (forceError === "1" || forceError === "true") {
    throw new Error("Forced global error for testing purposes");
  }

  return null;
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function GlobalErrorTestHelper() {
  const searchParams = useSearchParams();
  const forceError = searchParams.get("forceGlobalError");

  useEffect(() => {
    if (forceError === "1" || forceError === "true") {
      throw new Error("Forced global error for testing purposes");
    }
  }, [forceError]);

  return null;
}

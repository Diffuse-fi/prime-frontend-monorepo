"use client";

import { locationLogger } from "@/lib/core/utils/loggers";
import { usePathname } from "@/lib/localization/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function LocationLogger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    locationLogger.info("location change", {
      pathname,
      search: searchParams.toString(),
    });
  }, [pathname, searchParams]);

  return null;
}

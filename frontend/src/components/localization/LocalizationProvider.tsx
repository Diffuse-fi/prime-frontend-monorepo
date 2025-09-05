"use client";

import { ReactNode } from "react";
import {
  LocalizationContext,
  LocalizationValue,
} from "@/lib/localization/LocalizationContext";
import { useSyncDayjsLocale } from "@/lib/localization/useSyncDayjsLocale";

export function LocalizationProvider({
  value,
  children,
}: {
  value: LocalizationValue;
  children: ReactNode;
}) {
  useSyncDayjsLocale(value.lang);

  return (
    <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
  );
}

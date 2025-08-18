"use client";

import { Locale } from "./locale";
import { Dictionary } from "./dictionaries";
import { createContext, ReactNode } from "react";

export type LocalizationValue = {
  lang: Locale;
  dictionary: Dictionary;
};

export const LocalizationContext = createContext<LocalizationValue | null>(null);

export function LocalizationProvider({
  value,
  children,
}: {
  value: LocalizationValue;
  children: ReactNode;
}) {
  return (
    <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
  );
}

"use client";

import { useContext } from "react";
import { LocalizationContext } from "./LocalizationContext";

export function useLocalization() {
  const ctx = useContext(LocalizationContext);

  if (!ctx)
    throw new Error("useLocalization must be used within <LocalizationProvider/>");

  return { lang: ctx.lang, dict: ctx.dictionary, dir: ctx.dir };
}

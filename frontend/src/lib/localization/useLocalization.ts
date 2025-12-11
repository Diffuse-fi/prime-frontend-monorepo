"use client";

import { useLocale } from "next-intl";

import { isLocaleRtl } from "./locale";

export function useLocalization() {
  const locale = useLocale();
  const dir: "ltr" | "rtl" = isLocaleRtl(locale) ? "rtl" : "ltr";

  return { dir, locale };
}

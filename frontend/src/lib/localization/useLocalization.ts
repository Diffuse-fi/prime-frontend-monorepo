"use client";

import { useLocale } from "next-intl";
import { isLocaleRtl } from "./locale";

export function useLocalization() {
  const locale = useLocale();
  const dir = isLocaleRtl(locale) ? "rtl" : "ltr";

  return { locale, dir };
}

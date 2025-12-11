import { Locale } from "next-intl";

import localizationSettings from "@/localization.json" with { type: "json" };

export const SUPPORTED_LOCALES = localizationSettings.supported;
export const DEFAULT_LOCALE: Locale = localizationSettings.default;
const RTL = new Set(localizationSettings.rtl);

export function isLocaleRtl(locale: Locale): boolean {
  return RTL.has(locale);
}

export function localizedPath(lang: string, path: string) {
  const normalizedPath = path.replace(/^\/+/, "");

  if (lang === DEFAULT_LOCALE) {
    return normalizedPath;
  }

  return `${lang}/${normalizedPath}`;
}

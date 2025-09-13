import localizationSettings from "@/localization.json" with { type: "json" };
import { Locale } from "next-intl";

export const SUPPORTED_LOCALES = localizationSettings.supported;
export const DEFAULT_LOCALE: Locale = localizationSettings.default;
const RTL = new Set(localizationSettings.rtl);

export function isLocaleRtl(locale: Locale): boolean {
  return RTL.has(locale);
}

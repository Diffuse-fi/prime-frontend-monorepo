import localizationSettings from "@/localization.json" with { type: "json" };

export const SUPPORTED_LOCALES = localizationSettings.supported;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type PropsWithLocale<T extends object> = {
  [K in keyof T]: K extends "locale" ? Locale : T[K];
} & {
  locale?: Locale;
};

export const DEFAULT_LOCALE: Locale = localizationSettings.default;
export const RTL = new Set(localizationSettings.rtl);

export function isLocaleRtl(locale: Locale): boolean {
  return RTL.has(locale);
}

export function localizePath(path: string, locale?: Locale) {
  if (!locale || locale === DEFAULT_LOCALE) {
    return path;
  }
  return `/${locale}${path}`;
}

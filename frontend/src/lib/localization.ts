export const SUPPORTED_LOCALES = ["en"] as const; // Extend as needed for additional locales
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type PropsWithLocale<T extends object> = {
  [K in keyof T]: K extends "locale" ? Locale : T[K];
} & {
  locale?: Locale;
};

export const DEFAULT_LOCALE: Locale = "en";
export const RTL: Record<string, true> = { ar: true, he: true, fa: true, ur: true };

export function localizePath(path: string, locale: Locale) {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

import "server-only";
import { DEFAULT_LOCALE, Locale } from "@/lib/localization";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then(module => module.default),
} as const;

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries[DEFAULT_LOCALE]?.();

import "server-only";
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "./locale";

type DictionaryLoader = () => Promise<typeof import("../../dictionaries/en.json")>;

const dictionaries: Record<Locale, DictionaryLoader> = Array.from(
  new Set(SUPPORTED_LOCALES)
).reduce(
  (acc, locale) => {
    acc[locale] = () =>
      import(`../../dictionaries/${locale}.json`).then(module => module.default);
    return acc;
  },
  {} as Record<Locale, DictionaryLoader>
);

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries[DEFAULT_LOCALE]?.();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

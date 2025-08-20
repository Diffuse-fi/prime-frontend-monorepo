"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import localizationSettings from "../../localization.json" with { type: "json" };

const DEFAULT_LOCALE = localizationSettings.default;
const SUPPORTED_LOCALES = localizationSettings.supported;

dayjs.locale(DEFAULT_LOCALE);

const loaders = SUPPORTED_LOCALES.reduce(
  (acc, locale) => {
    acc[locale] = () => import(`dayjs/locale/${locale}.js`);
    return acc;
  },
  {} as Record<string, () => Promise<unknown>>
);

const loadedLocales = new Set<string>();

export function useSyncDayjsLocale(lang: string = DEFAULT_LOCALE) {
  useEffect(() => {
    if (loadedLocales.has(lang)) {
      dayjs.locale(lang);
      return;
    }

    loaders[lang]()
      .then(() => {
        dayjs.locale(lang);
        loadedLocales.add(lang);
      })
      .catch(() => {
        if (DEFAULT_LOCALE && DEFAULT_LOCALE !== lang) {
          return loaders[DEFAULT_LOCALE]().then(() => {
            dayjs.locale(DEFAULT_LOCALE);
            loadedLocales.add(DEFAULT_LOCALE);
          });
        }
      });
  }, [lang]);
}

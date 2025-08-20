"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import localizationSettings from "../../localization.json" with { type: "json" };

const defaultLocale = localizationSettings.default;
dayjs.locale(defaultLocale); // Set the default locale initially

const loadedLocales = new Set<string>();

export function useSyncDayjsLocale(lang: string = defaultLocale) {
  useEffect(() => {
    if (loadedLocales.has(lang)) {
      dayjs.locale(lang);
      return;
    }

    import(`dayjs/locale/${lang}`)
      .then(() => {
        dayjs.locale(lang);
        loadedLocales.add(lang);
      })
      .catch(() => {
        if (defaultLocale && defaultLocale !== lang) {
          return import(`dayjs/locale/${defaultLocale}`).then(() => {
            dayjs.locale(defaultLocale);
            loadedLocales.add(defaultLocale);
          });
        }
      });
  }, [lang]);
}

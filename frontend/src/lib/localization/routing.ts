import { defineRouting } from "next-intl/routing";

import localizationSettings from "@/localization.json" with { type: "json" };

import messages from "../../dictionaries/en.json";

export const localizationRouting = defineRouting({
  defaultLocale: localizationSettings.default,
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
    name: "NEXT_LOCALE",
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  localeDetection: true,
  localePrefix: "as-needed",
  locales: localizationSettings.supported,
});

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof localizationRouting.locales)[number];
    Messages: typeof messages;
  }
}

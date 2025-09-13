import localizationSettings from "@/localization.json" with { type: "json" };
import { defineRouting } from "next-intl/routing";
import messages from "../../dictionaries/en.json";

export const localizationRouting = defineRouting({
  locales: localizationSettings.supported,
  defaultLocale: localizationSettings.default,
  localeDetection: true,
  localePrefix: "as-needed",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof localizationRouting.locales)[number];
    Messages: typeof messages;
  }
}

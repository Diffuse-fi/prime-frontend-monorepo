import localizationSettings from "@/localization.json" with { type: "json" };
import { defineRouting } from "next-intl/routing";

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

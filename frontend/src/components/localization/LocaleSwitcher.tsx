"use client";

import { Locale } from "next-intl";
import { usePathname } from "next/navigation";

import localizationSettings from "../../localization.json" with { type: "json" };
import { AppLink } from "../misc/AppLink";

const SUPPORTED_LOCALES = localizationSettings.supported;

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const getPathnameWithoutLocale = (locale: Locale) => {
    const localePrefix = `/${locale}`;
    return pathname.startsWith(localePrefix)
      ? pathname.slice(localePrefix.length)
      : pathname;
  };

  return (
    <div>
      <p>Locale switcher:</p>
      <ul>
        {SUPPORTED_LOCALES.map(locale => {
          return (
            <li key={locale}>
              <AppLink href={getPathnameWithoutLocale(locale)}>{locale}</AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

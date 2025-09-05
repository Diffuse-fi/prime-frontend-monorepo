"use client";

import { usePathname } from "next/navigation";
import { Locale } from "@/lib/localization/locale";
import localizationSettings from "../../localization.json" with { type: "json" };
import Link from "../shared/Link";

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
              <Link href={getPathnameWithoutLocale(locale)} locale={locale}>
                {locale}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

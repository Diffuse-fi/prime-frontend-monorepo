import localizationSettings from "@/localization.json" with { type: "json" };
import { IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const store = await cookies();
  const maybeLocale = store.get("NEXT_LOCALE")?.value || localizationSettings.default;

  const locale = localizationSettings.supported.includes(maybeLocale)
    ? maybeLocale
    : localizationSettings.default;

  return {
    locale,
    messages: (await import(`../../dictionaries/${locale}.json`)).default,

    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(part => part != null).join(".");

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path + " is not yet translated";
      } else {
        return "Dear developer, please fix this message: " + path;
      }
    },
  };
});

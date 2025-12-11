import { IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import localizationSettings from "@/localization.json" with { type: "json" };

export default getRequestConfig(async () => {
  const store = await cookies();
  const maybeLocale = store.get("NEXT_LOCALE")?.value || localizationSettings.default;

  const locale = localizationSettings.supported.includes(maybeLocale)
    ? maybeLocale
    : localizationSettings.default;

  return {
    getMessageFallback({ error, key, namespace }) {
      const path = [namespace, key].filter(part => part != undefined).join(".");

      return error.code === IntlErrorCode.MISSING_MESSAGE
        ? path + " is not yet translated"
        : "Dear developer, please fix this message: " + path;
    },
    locale,

    // eslint-disable-next-line unicorn/no-await-expression-member
    messages: (await import(`../../dictionaries/${locale}.json`)).default,
  };
});

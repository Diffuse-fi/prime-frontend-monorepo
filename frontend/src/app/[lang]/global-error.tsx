"use client";

import { isSentryEnabled } from "@/lib/sentry";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const t = useTranslations("globalError");

  useEffect(() => {
    if (isSentryEnabled) Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="grid min-h-dvh place-items-center p-6">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>

          {error?.digest ? (
            <p className="text-muted-foreground text-xs">
              {t("diagnosticId", { id: error.digest })}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-center gap-3">
            <button className="btn" onClick={() => reset()}>
              {t("tryAgain")}
            </button>
            <a className="btn-ghost" href={`/${/* locale preserved by segment */ ""}`}>
              {t("goHome")}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

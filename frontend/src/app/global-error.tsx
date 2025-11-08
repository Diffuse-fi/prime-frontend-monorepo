"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled } from "@/lib/sentry";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    if (isSentryEnabled) Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100dvh",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1>Something went wrong</h1>
          <p>Please try again or go back home.</p>
          {error?.digest && (
            <p style={{ opacity: 0.7, fontSize: 12 }}>Diagnostic ID: {error.digest}</p>
          )}
          <a
            href="/"
            style={{
              textDecoration: "underline",
              marginTop: 12,
              display: "inline-block",
            }}
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}

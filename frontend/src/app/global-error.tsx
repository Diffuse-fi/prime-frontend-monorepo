"use client";

import { isSentryEnabled } from "@/lib/sentry";
import { ButtonLike } from "@diffuse/ui-kit/ButtonLike";
import { Container } from "@diffuse/ui-kit/Container";
import { Heading } from "@diffuse/ui-kit/Heading";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Card } from "@diffuse/ui-kit/Card";
import { ThemeProvider } from "next-themes";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (isSentryEnabled) Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Container
            as="main"
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <Card
              header={
                <Heading align="center" level="2">
                  Something went wrong
                </Heading>
              }
              className="max-w-lg"
              cardBodyClassName="flex flex-col items-center gap-4"
            >
              <p className="text-muted text-center">
                An unexpected error occurred while loading the app. You can try again or
                go back to the main page.
              </p>
              {process.env.NODE_ENV !== "production" && (
                <div className="border-border bg-fg/5 text-muted-foreground w-full max-w-lg rounded-xl border px-4 py-3 text-left font-mono text-xs">
                  <div className="mb-1 font-semibold">Debug info:</div>
                  {error.message?.trim() && (
                    <p className="mb-1 break-words">{error.message}</p>
                  )}
                  {error.digest && (
                    <p className="text-muted text-sm">Error ID: {error.digest}</p>
                  )}
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <ButtonLike variant="solid" size="lg" onClick={reset}>
                  Try again
                </ButtonLike>
                <ButtonLike href="/" component="a" variant="ghost" size="lg">
                  Back to app
                </ButtonLike>
              </div>
            </Card>
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}

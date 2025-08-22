import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled } from "./lib/sentry";

const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";

Sentry.init({
  enabled: isSentryEnabled,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0,
  enableLogs: true,
  debug: false,
  environment: env,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

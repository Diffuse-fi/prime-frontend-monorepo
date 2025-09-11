import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled } from "./lib/sentry";
import { env } from "./env";

const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;

Sentry.init({
  enabled: isSentryEnabled,
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0,
  enableLogs: true,
  debug: false,
  environment,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

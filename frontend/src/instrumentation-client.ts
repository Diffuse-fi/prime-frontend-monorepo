import * as Sentry from "@sentry/nextjs";

import { env } from "./env";
import { isSentryEnabled } from "./lib/sentry";

const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;

Sentry.init({
  debug: false,
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: isSentryEnabled,
  enableLogs: true,
  environment,
  replaysSessionSampleRate: 0,
  sendDefaultPii: true,
  tracesSampleRate: 1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

import { isSentryEnabled } from "@/lib/sentry";
import * as Sentry from "@sentry/nextjs";

const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";

Sentry.init({
  enabled: isSentryEnabled,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  enableLogs: true,
  debug: false,
  environment: env,
});

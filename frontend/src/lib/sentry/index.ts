import { env } from "@/env";

export const isSentryEnabled =
  process.env.NODE_ENV === "production" &&
  !!env.NEXT_PUBLIC_ENABLE_SENTRY &&
  !!env.NEXT_PUBLIC_SENTRY_DSN;

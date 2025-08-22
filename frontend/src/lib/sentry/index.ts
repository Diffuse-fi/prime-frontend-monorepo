export const isSentryEnabled =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true" &&
  !!process.env.NEXT_PUBLIC_SENTRY_DSN;

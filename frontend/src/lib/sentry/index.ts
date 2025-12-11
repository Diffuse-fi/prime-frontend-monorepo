import { env } from "@/env";

export const isSentryEnabled =
  !!env.NEXT_PUBLIC_ENABLE_SENTRY && !!env.NEXT_PUBLIC_SENTRY_DSN;

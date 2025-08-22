import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { getHeaders } from "./headers";

const isProd = process.env.NODE_ENV === "production";
const sentryOrg = process.env.SENTRY_ORGANIZATION;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

const nextConfig: NextConfig = {
  // To catch typical React issues in development
  reactStrictMode: true,
  // Memory optimization and prevents source code exposure on the client
  productionBrowserSourceMaps: false,
  experimental: {
    // Memory usage optimization
    serverSourceMaps: false,
  },
  headers: () => getHeaders(isProd),
};

const sentryBuildOptions = {
  org: sentryOrg,
  project: sentryProject,
  authToken: sentryAuthToken,
  // Don't spam the terminal with logs unless in CI
  silent: !process.env.CI,
  // Upload a larger set of source maps for prettier stack traces.
  widenClientFileUpload: true,
  tunnelRoute: true,
  disableLogger: true,
  reactComponentAnnotation: {
    enabled: true,
  },
} satisfies SentryBuildOptions;

export default isProd ? withSentryConfig(nextConfig, sentryBuildOptions) : nextConfig;

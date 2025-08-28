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
  images: {
    // We use nextjs <Image> component to display token images from external sources.
    // This option enables to fetch those images on the server side and optimize them for
    // better performance.
    remotePatterns: [
      // Load token images from smold.app (Bera, USDC, etc)
      {
        protocol: "https",
        hostname: "assets.smold.app",
      },
      // Load token images from raw.githubusercontent.com (Trustwallet tokenlist or other)
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
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

import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { getHeaders } from "./headers";
import createNextIntlPlugin from "next-intl/plugin";
import localizatiionSettings from "./src/localization.json" with { type: "json" };
import { getRemotePatternsFromAssetsAndChains } from "@/lib/misc/nextImagePatterns";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/lib/localization/request.ts",
});

const isProd = process.env.NODE_ENV === "production";
const isVercelProdDeploy = process.env.VERCEL_ENV === "production";

const enableHSTS = process.env.ENABLE_HTTPS_SECURITY_HEADERS === "true";
const sentryOrg = process.env.SENTRY_ORGANIZATION;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryEnabled = process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true";

const enableSentry =
  isProd &&
  isVercelProdDeploy &&
  Boolean(sentryOrg && sentryProject && sentryAuthToken && sentryEnabled);

const SUPPORTED_LOCALES = localizatiionSettings.supported;
const DEFAULT_LOCALE = localizatiionSettings.default;
const others = SUPPORTED_LOCALES.filter(l => l !== DEFAULT_LOCALE);
const othersGroup = others.join("|");

const nextConfig: NextConfig = {
  webpack: config => {
    // Shim for @react-native-async-storage/async-storage to make it work in web/Next.js environment
    config.resolve.alias["@react-native-async-storage/async-storage"] = require.resolve(
      "./src/lib/shims/async-storage-web.ts"
    );
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // To catch typical React issues in development
  reactStrictMode: true,
  // Memory optimization and prevents source code exposure on the client
  productionBrowserSourceMaps: false,
  experimental: {
    // Memory usage optimization
    serverSourceMaps: false,
  },
  headers: () => getHeaders(enableHSTS),
  images: {
    // We use nextjs <Image> component to display asset images from external sources.
    // This option enables to fetch those images on the server side and optimize them for
    // better performance.
    remotePatterns: [
      ...getRemotePatternsFromAssetsAndChains(),
    ],
  },
  redirects: async () => {
    const redirects = [
      // Home path ("/") does not exist, redirect to /lend
      {
        source: "/",
        destination: "/lend",
        permanent: false,
      },
    ];

    // Redirects for other locales to their /lend page
    // e.g. /fr -> /fr/lend, /de -> /de/l
    if (othersGroup.length > 0) {
      redirects.push({
        source: `/:lang(${othersGroup})`,
        destination: "/:lang/lend",
        permanent: false,
      });
    }

    return redirects;
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
  telemetry: false,
} satisfies SentryBuildOptions;

export default withNextIntl(
  enableSentry ? withSentryConfig(nextConfig, sentryBuildOptions) : nextConfig
);

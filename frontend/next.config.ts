import type { NextConfig } from "next";
import { getHeaders } from "./headers";

const isProd = process.env.NODE_ENV === "production";

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

export default nextConfig;

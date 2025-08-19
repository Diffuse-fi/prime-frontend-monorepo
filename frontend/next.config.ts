import type { NextConfig } from "next";
import { getHeaders } from "./headers";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  headers: () => getHeaders(isProd),
};

export default nextConfig;

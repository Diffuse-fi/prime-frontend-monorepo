import type { MetadataRoute } from "next";

import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: "/private/",
      userAgent: "*",
    },
    sitemap: `${env.ORIGIN}/sitemap.xml`,
  };
}

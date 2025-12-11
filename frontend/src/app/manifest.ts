import { MetadataRoute } from "next";

import { env } from "@/env";

export const dynamic = "force-static";
export const revalidate = 86_400;

export default function manifest(): MetadataRoute.Manifest {
  return {
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    display: "standalone",
    icons: [
      {
        purpose: "any",
        sizes: "512x512",
        src: "/icon-512.png?v=1",
        type: "image/png",
      },
      // TODO - add when ready
      // {
      //   src: "/icon-192.png?v=1",
      //   sizes: "192x192",
      //   type: "image/png",
      //   purpose: "any",
      // },
      // icons for google search display - 48x48, 72x72, 96x96, 144x144, 192x192
    ],
    name: env.NEXT_PUBLIC_APP_NAME,
    short_name: env.NEXT_PUBLIC_APP_NAME,
    start_url: "/lend",
  };
}

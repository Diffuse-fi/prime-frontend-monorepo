import { env } from "@/env";
import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 86400;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: env.NEXT_PUBLIC_APP_NAME,
    short_name: env.NEXT_PUBLIC_APP_NAME,
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    start_url: "/lend",
    display: "standalone",
    icons: [
      {
        src: "/icon-512.png?v=1",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // TODO - add when ready
      // {
      //   src: "/icon-192.png?v=1",
      //   sizes: "192x192",
      //   type: "image/png",
      //   purpose: "any",
      // },
    ],
  };
}

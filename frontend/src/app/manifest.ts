import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Defuse Prime",
    short_name: "Defuse",
    description: "Defuse Prime is a ...",
    theme_color: "",
    background_color: "",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "/icons/logo_192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "/icons/logo_maskable_192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/icons/logo_512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}

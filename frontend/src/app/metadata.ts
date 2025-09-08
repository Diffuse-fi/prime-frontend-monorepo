import { Metadata } from "next";
import localizationSettings from "../localization.json" with { type: "json" };
import { apiUrl } from "@/lib/api";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

const SUPPORTED_LOCALES = localizationSettings.supported;
const origin = process.env.ORIGIN ?? "";

export const defaultMetadata = {
  title: "Diffuse Prime",
  description: "",
  keywords: [
    "",
  ],
  applicationName: process.env.NEXT_PUBLIC_APP_NAME,
  authors: [{ name: "ukorvl", url: "https://github.com/ukorvl" }],
  metadataBase: new URL(origin),
  alternates: {
    canonical: origin,
    languages: SUPPORTED_LOCALES.reduce(
      (acc, lang) => {
        acc[lang] = `${origin}/${lang}`;
        return acc;
      },
      {} as Record<string, string>
    ),
  },
  openGraph: {
    title: "Diffuse Prime",
    description: "",
    locale: "en_US",
    type: "website",
    siteName: "Diffuse Prime",
    url: "/",
    images: [
      {
        url: apiUrl("og", { title: "Diffuse Prime" }),
        width: 1200,
        height: 630,
        alt: "Diffuse Prime",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diffuse Prime",
    description: "",
    site: "@diffuseprime",
    creator: "@diffuseprime",
    images: [
      apiUrl("og", { title: "Diffuse Prime" }),
    ],
  },
} satisfies Metadata;

export function buildMetadataForPage({
  title,
  path,
  description,
}: PageMetadataOptions): Metadata {
  return {
    ...defaultMetadata,
    title: `${title} | Diffuse Prime`,
    description,
    alternates: {
      canonical: `${origin}/${path}`,
      languages: SUPPORTED_LOCALES.reduce(
        (acc, lang) => {
          acc[lang] = `${origin}/${lang}/${path}`;
          return acc;
        },
        {} as Record<string, string>
      ),
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${title} | Diffuse Prime`,
      description,
      url: `/${path}`,
      images: [
        {
          url: apiUrl("og", { title: title || "Diffuse Prime", path, description }),
          width: 1200,
          height: 630,
          alt: `${title} | Diffuse Prime`,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} | Diffuse Prime`,
      description,
      images: [
        apiUrl("og", { title: title || "Diffuse Prime", path, description }),
      ],
    },
  };
}

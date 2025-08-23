import { Metadata } from "next";
import localizationSettings from "../localization.json" with { type: "json" };

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
}

const SUPPORTED_LOCALES = localizationSettings.supported;
const origin = process.env.ORIGIN ?? "";

function addSearchParamsToUrl(url: string, params: Record<string, string>) {
  return `${url}?${new URLSearchParams(params).toString()}`;
}

export const defaultMetadata = {
  title: "Defuse Prime",
  description: "",
  keywords: [
    "",
  ],
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
    title: "Defuse Prime",
    description: "",
    locale: "en_US",
    type: "website",
    siteName: "Defuse Prime",
    url: "/",
    images: [
      {
        url: addSearchParamsToUrl("/api/og", { title: "Defuse Prime" }),
        width: 1200,
        height: 630,
        alt: "Defuse Prime",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Defuse Prime",
    description: "",
    site: "@defuseprime",
    creator: "@defuseprime",
    images: [
      addSearchParamsToUrl("/api/og", { title: "Defuse Prime" }),
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
    title: `${title} | Defuse Prime`,
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
      title: `${title} | Defuse Prime`,
      description,
      url: `/${path}`,
      images: [
        {
          url: addSearchParamsToUrl(`/api/og/${path}`, {
            title: title || "Defuse Prime",
          }),
          width: 1200,
          height: 630,
          alt: `${title} | Defuse Prime`,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} | Defuse Prime`,
      description,
      images: [
        addSearchParamsToUrl(`/api/og/${path}`, { title: title || "Defuse Prime" }),
      ],
    },
  };
}

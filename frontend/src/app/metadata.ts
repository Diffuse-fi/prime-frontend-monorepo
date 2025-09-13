import { Metadata } from "next";
import localizationSettings from "../localization.json" with { type: "json" };
import { apiUrl } from "@/lib/api";
import { env } from "@/env";
import { Locale } from "next-intl";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords: string;
  locale: Locale;
}

const SUPPORTED_LOCALES = localizationSettings.supported;
const origin = env.ORIGIN;
const twitterAccount = env.ORG_TWITTER_ACCOUNT;

export const defaultMetadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  applicationName: env.NEXT_PUBLIC_APP_NAME,
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
    title: env.NEXT_PUBLIC_APP_NAME,
    description: "",
    locale: "en_US",
    type: "website",
    siteName: env.NEXT_PUBLIC_APP_NAME,
    url: "/",
    images: [
      {
        url: apiUrl("og", { title: env.NEXT_PUBLIC_APP_NAME }),
        width: 1200,
        height: 630,
        alt: env.NEXT_PUBLIC_APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: env.NEXT_PUBLIC_APP_NAME,
    description: "",
    site: twitterAccount,
    creator: twitterAccount,
    images: [
      apiUrl("og", { title: env.NEXT_PUBLIC_APP_NAME }),
    ],
  },
} satisfies Metadata;

export function buildRootMetadata(
  params: Omit<PageMetadataOptions, "title" | "path">
): Metadata {
  return {
    ...defaultMetadata,
    title: env.NEXT_PUBLIC_APP_NAME,
    description: params.description,
    keywords: params.keywords,
    alternates: {
      ...defaultMetadata.alternates,
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
      ...defaultMetadata.openGraph,
      description: params.description,
      title: env.NEXT_PUBLIC_APP_NAME,
      locale: params.locale,
      url: "/",
    },
    twitter: {
      ...defaultMetadata.twitter,
      description: params.description,
      title: env.NEXT_PUBLIC_APP_NAME,
    },
  };
}

export function buildMetadataForPage({
  title,
  path,
  description,
  keywords,
  locale,
}: PageMetadataOptions): Metadata {
  return {
    ...defaultMetadata,
    title: `${title} | ${env.NEXT_PUBLIC_APP_NAME}`,
    keywords: keywords,
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
      title: `${title} | ${env.NEXT_PUBLIC_APP_NAME}`,
      description,
      url: `/${path}`,
      locale: locale,
      images: [
        {
          url: apiUrl("og", {
            title: title || env.NEXT_PUBLIC_APP_NAME,
            path,
            description,
          }),
          width: 1200,
          height: 630,
          alt: `${title} | ${env.NEXT_PUBLIC_APP_NAME}`,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} | ${env.NEXT_PUBLIC_APP_NAME}`,
      description,
      images: [
        apiUrl("og", { title: title || env.NEXT_PUBLIC_APP_NAME, path, description }),
      ],
    },
  };
}

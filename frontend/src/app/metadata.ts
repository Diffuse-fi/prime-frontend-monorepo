import { Metadata } from "next";
import { Locale } from "next-intl";

import { env } from "@/env";
import { apiUrl } from "@/lib/api";
import { normalizeTwitterHandle, toOgLocale } from "@/lib/misc/metadata";

import localizationSettings from "../localization.json" with { type: "json" };

interface PageMetadataOptions {
  description: string;
  keywords: string;
  locale: Locale;
  path: string;
  title: string;
}

const SUPPORTED_LOCALES = localizationSettings.supported;
const DEFAULT_LOCALE = localizationSettings.default;
const needAlternates = SUPPORTED_LOCALES.length > 1;
const origin = env.ORIGIN;
const appName = env.NEXT_PUBLIC_APP_NAME;
const twitterAccount = env.ORG_TWITTER_ACCOUNT;
const ogVersion = env.NEXT_PUBLIC_OG_VERSION || "1";

function generateAlternates(path: string, locale: string) {
  if (!needAlternates) {
    return;
  }

  const languages = SUPPORTED_LOCALES.reduce(
    (acc, lang) => {
      acc[lang] = lang === DEFAULT_LOCALE ? `/${path}` : `/${lang}/${path}`;
      return acc;
    },
    { "x-default": path } as Record<string, string>
  );

  return {
    canonical: locale === DEFAULT_LOCALE ? `/${path}` : `/${locale}/${path}`,
    languages,
  };
}

export const defaultMetadata = {
  applicationName: appName,
  authors: [{ name: "ukorvl", url: "https://github.com/ukorvl" }],
  description: env.NEXT_PUBLIC_APP_DESCRIPTION,
  metadataBase: new URL(origin),
  openGraph: {
    siteName: appName,
    title: appName,
    type: "website",
  },
  title: appName,
  twitter: {
    card: "summary_large_image",
    creator: normalizeTwitterHandle(twitterAccount),
    site: normalizeTwitterHandle(twitterAccount),
    title: appName,
  },
} satisfies Metadata;

export function buildMetadataForPage({
  description,
  keywords,
  locale,
  path,
  title,
}: PageMetadataOptions): Metadata {
  const ogLocale = toOgLocale(locale);
  const ogLocaleAlternate = SUPPORTED_LOCALES.map(element => toOgLocale(element)).filter(
    l => l !== ogLocale
  );

  return {
    ...defaultMetadata,
    alternates: generateAlternates(path, locale),
    description,
    keywords: keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      alternateLocale: ogLocaleAlternate,
      description,
      images: [
        {
          alt: `${title} | ${appName}`,
          height: 630,
          url: apiUrl("og", {
            description,
            path,
            title: title || appName,
            v: ogVersion,
          }),
          width: 1200,
        },
      ],
      locale: ogLocale,
      title: `${title} | ${appName}`,
      url: locale === DEFAULT_LOCALE ? path : `/${locale}/${path}`,
    },
    title: `${title} | ${appName}`,
    twitter: {
      ...defaultMetadata.twitter,
      description,
      images: [
        apiUrl("og", {
          description,
          path,
          title: title || appName,
          v: ogVersion,
        }),
      ],
      title: `${title} | ${appName}`,
    },
  };
}

import { Metadata } from "next";
import localizationSettings from "../localization.json" with { type: "json" };
import { apiUrl } from "@/lib/api";
import { env } from "@/env";
import { Locale } from "next-intl";
import { normalizeTwitterHandle, toOgLocale } from "@/lib/misc/metadata";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords: string;
  locale: Locale;
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
    return undefined;
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
  title: appName,
  applicationName: appName,
  description: env.NEXT_PUBLIC_APP_DESCRIPTION,
  authors: [{ name: "ukorvl", url: "https://github.com/ukorvl" }],
  metadataBase: new URL(origin),
  openGraph: {
    title: appName,
    type: "website",
    siteName: appName,
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    site: normalizeTwitterHandle(twitterAccount),
    creator: normalizeTwitterHandle(twitterAccount),
  },
} satisfies Metadata;

export function buildMetadataForPage({
  title,
  path,
  description,
  keywords,
  locale,
}: PageMetadataOptions): Metadata {
  const ogLocale = toOgLocale(locale);
  const ogLocaleAlternate = SUPPORTED_LOCALES.map(toOgLocale).filter(l => l !== ogLocale);

  return {
    ...defaultMetadata,
    title: `${title} | ${appName}`,
    keywords: keywords,
    description,
    alternates: generateAlternates(path, locale),
    openGraph: {
      ...defaultMetadata.openGraph,
      title: `${title} | ${appName}`,
      description,
      locale: ogLocale,
      alternateLocale: ogLocaleAlternate,
      url: locale === DEFAULT_LOCALE ? path : `/${locale}/${path}`,
      images: [
        {
          url: apiUrl("og", {
            title: title || appName,
            path,
            description,
            v: ogVersion,
          }),
          width: 1200,
          height: 630,
          alt: `${title} | ${appName}`,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: `${title} | ${appName}`,
      description,
      images: [
        apiUrl("og", {
          title: title || appName,
          path,
          description,
          v: ogVersion,
        }),
      ],
    },
  };
}

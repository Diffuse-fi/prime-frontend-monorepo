import { Metadata } from "next";
import localizationSettings from "../localization.json" with { type: "json" };

const SUPPORTED_LOCALES = localizationSettings.supported;
const origin = process.env.ORIGIN ?? "";

const metadata: Metadata = {
  title: {
    default: "Defuse Prime",
    template: "%s | Defuse Prime",
  },
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
    url: origin,
    images: [
      {
        url: `${origin}/og-image.png`,
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
    images: [`${origin}/og-image.png`],
  },
};

export default metadata;

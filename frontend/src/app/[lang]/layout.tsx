import type { Metadata, Viewport } from "next";
import { Providers } from "../providers";
import { fonts } from "../fonts/fonts";
import "@rainbow-me/rainbowkit/styles.css";
import "../globals.css";
import {
  DEFAULT_LOCALE,
  isLocaleRtl,
  Locale,
  SUPPORTED_LOCALES,
} from "@/lib/localization/locale";
import defaultMeta from "../metadata";
import { getDictionary } from "@/lib/localization/dictionaries";
import { Container } from "@/ui/Container";
import { LocalizationProvider } from "@/lib/localization/LocalizationContext";

export const metadata: Metadata = {
  ...defaultMeta,
};

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(lang => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "light",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang = DEFAULT_LOCALE } = await params;
  const dir = isLocaleRtl(lang) ? "rtl" : "ltr";
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} dir={dir}>
      <body
        className={`${fonts.SFProText.variable} ${fonts.GeistMono.variable} antialiased`}
      >
        <LocalizationProvider
          value={{
            lang,
            dictionary,
          }}
        >
          <Providers locale={lang}>
            <Container>{children}</Container>
          </Providers>
        </LocalizationProvider>
      </body>
    </html>
  );
}

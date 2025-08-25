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
import { defaultMetadata } from "../metadata";
import { getDictionary } from "@/lib/localization/dictionaries";
import { LocalizationProvider } from "@/components/LocalizationProvider";
import { ThemeProvider } from "next-themes";
import { Container } from "@diffuse/ui-kit";
import { GoogleTagManager } from "@next/third-parties/google";
import { headers } from "next/headers";
import { nonceHeader } from "@/lib/nonce";
import { WebVitals } from "@/components/WebVitals";

export const metadata: Metadata = {
  ...defaultMetadata,
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
  const nonce = (await headers()).get(nonceHeader) ?? undefined;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";
  const gtagEnabled = process.env.NEXT_PUBLIC_ENABLE_GTAG === "true";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      {gtagEnabled && (
        <>
          <GoogleTagManager gtmId={gtmId} nonce={nonce} />
          <WebVitals />
        </>
      )}
      <body className={`${fonts.SFProText.variable} antialiased`}>
        <LocalizationProvider
          value={{
            lang,
            dictionary,
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            nonce={nonce}
          >
            <Providers locale={lang}>
              <Container>{children}</Container>
            </Providers>
          </ThemeProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}

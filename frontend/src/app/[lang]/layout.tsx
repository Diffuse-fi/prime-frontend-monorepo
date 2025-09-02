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
import { Container, Navbar, Text } from "@diffuse/ui-kit";
import { GoogleTagManager } from "@next/third-parties/google";
import { headers } from "next/headers";
import { nonceHeader } from "@/lib/nonce";
import { WebVitals } from "@/components/WebVitals";
import Link from "@/components/Link";
import ConnectButton from "@/components/ConnectButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Image from "next/image";
import { ClientNavigation } from "@/components/ClientNavigation";

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
              <Navbar
                className="sticky top-0 z-50"
                logo={
                  <Link
                    href="/"
                    className="flex gap-2 items-center select-none"
                    locale={lang}
                  >
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                    <Text weight="semibold" className="uppercase">
                      {dictionary.common.navbar.title}
                    </Text>
                  </Link>
                }
                navigation={
                  <ClientNavigation
                    ariaLabel="Site navigation"
                    locale={lang}
                    config={[
                      {
                        href: "/lend",
                        label: dictionary.common.navbar.navigation.lend,
                      },
                      {
                        href: "/borrow",
                        label: dictionary.common.navbar.navigation.borrow,
                        disabled: true,
                      },
                    ]}
                  />
                }
                wallet={
                  <div className="flex gap-4">
                    <ThemeSwitcher />
                    <ConnectButton />
                  </div>
                }
              />
              <Container>{children}</Container>
            </Providers>
          </ThemeProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}

import type { Viewport } from "next";

import { Navbar } from "@diffuse/ui-kit/Navbar";
import { TooltipProvider } from "@diffuse/ui-kit/Tooltip";
import "@rainbow-me/rainbowkit/styles.css";

import "../globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Locale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import Image from "next/image";

import { ChainSyncEffects } from "@/components/chains/ChainSyncEffects";
import { ReadonlyChainProvider } from "@/components/chains/ReadonlyChainProvider";
import { AppLink } from "@/components/misc/AppLink";
import { ClientNavigation } from "@/components/misc/ClientNavigation";
import { ConnectionStatusTracker } from "@/components/misc/ConnectionStatusTracker";
import { JsonLd } from "@/components/misc/JsonLd";
import { LocationLogger } from "@/components/misc/LocationLogger";
import ThemeSwitcher from "@/components/misc/ThemeSwitcher";
import { WalletTracker } from "@/components/misc/WalletTracker";
import { WebVitals } from "@/components/misc/WebVitals";
import ToastProvider from "@/components/toast/ToastProvider";
import WalletBar from "@/components/wagmi/WalletBar";
import { env } from "@/env";
import {
  DEFAULT_LOCALE,
  isLocaleRtl,
  SUPPORTED_LOCALES,
} from "@/lib/localization/locale";

import { fonts } from "../fonts/fonts";
import { org, site } from "../jsonld";
import { Providers } from "../providers";

export const dynamic = "force-static";
export const revalidate = 600;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(lang => ({ lang }));
}

export const viewport: Viewport = {
  // Don't scale initially
  initialScale: 1,
  // Makes sure the viewport resizes correctly when virtual keyboard appears
  interactiveWidget: "resizes-content",
  // Good for accessibility scaling limit
  maximumScale: 5,
  // makes sure the viewport covers the entire screen on iOS, safe area is needed, make sure to add padding where appropriate
  viewportFit: "cover",
  // Makes mobile browser scale to fit screen width instead of making the page 980px wide
  width: "device-width",
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
  const gaId = env.GOOGLE_ANALYTICS_ID;
  const trackingEnabled = !!env.NEXT_PUBLIC_ENABLE_TRACKING;
  const messages = await getMessages({ locale: lang });
  const tCommon = await getTranslations({ locale: lang, namespace: "common" });

  return (
    <html
      className={`${fonts.DM_Sans.className} ${fonts.DM_mono.variable} h-screen antialiased supports-[height:100dvh]:h-dvh`}
      dir={dir}
      lang={lang}
      suppressHydrationWarning
    >
      <body className="px-safe pb-safe h-full">
        {trackingEnabled && gaId && (
          <>
            <GoogleAnalytics gaId={gaId} />
            <WebVitals />
          </>
        )}
        <JsonLd
          graph={{
            "@context": "https://schema.org",
            "@graph": [org, site],
          }}
        />
        <TooltipProvider delayDuration={200}>
          <NextIntlClientProvider locale={lang} messages={messages}>
            <ConnectionStatusTracker />
            {trackingEnabled && <WalletTracker />}
            {env.NEXT_PUBLIC_DEBUG && <LocationLogger />}
            <ToastProvider
              appearOnTop
              defaultPosition="bottom-right"
              duration={1000 * 5}
              maxToastsToShow={3}
            />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              <ReadonlyChainProvider>
                <Providers locale={lang}>
                  <ChainSyncEffects />
                  <Navbar
                    className="pt-safe sticky top-0 z-50"
                    logo={
                      <AppLink
                        className="standard-focus-ring flex items-center gap-2 rounded-md p-1 select-none"
                        href="/"
                      >
                        <Image
                          alt={env.NEXT_PUBLIC_APP_NAME}
                          height={32}
                          priority
                          src="/logo.svg?v=1"
                          width={32}
                        />
                        <p className="text-secondary hidden text-lg font-bold whitespace-nowrap sm:block">
                          {tCommon("navbar.title")}
                        </p>
                      </AppLink>
                    }
                    navigation={
                      <ClientNavigation
                        ariaLabel="Site navigation"
                        config={[
                          {
                            href: "/lend",
                            label: tCommon("navbar.navigation.lend"),
                          },
                          {
                            href: "/borrow",
                            label: tCommon("navbar.navigation.borrow"),
                          },
                        ]}
                      />
                    }
                    wallet={
                      <div className="flex gap-2 sm:gap-4">
                        <ThemeSwitcher />
                        <WalletBar />
                      </div>
                    }
                  />
                  {children}
                </Providers>
              </ReadonlyChainProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

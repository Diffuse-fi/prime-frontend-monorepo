import type { Metadata, Viewport } from "next";
import { Providers } from "../providers";
import { fonts } from "../fonts/fonts";
import "@rainbow-me/rainbowkit/styles.css";
import "../globals.css";
import {
  DEFAULT_LOCALE,
  isLocaleRtl,
  SUPPORTED_LOCALES,
} from "@/lib/localization/locale";
import { buildRootMetadata } from "../metadata";
import { ThemeProvider } from "next-themes";
import { GoogleTagManager } from "@next/third-parties/google";
import { WebVitals } from "@/components/misc/WebVitals";
import ThemeSwitcher from "@/components/misc/ThemeSwitcher";
import Image from "next/image";
import { ClientNavigation } from "@/components/misc/ClientNavigation";
import { Navbar } from "@diffuse/ui-kit/Navbar";
import { Container } from "@diffuse/ui-kit/Container";
import ToastProvider from "@/components/toast";
import { TooltipProvider } from "@diffuse/ui-kit/Tooltip";
import { env } from "@/env";
import { Locale, NextIntlClientProvider } from "next-intl";
import { ConnectionStatusTracker } from "@/components/misc/ConnectionStatusTracker";
import { getMessages, getTranslations } from "next-intl/server";
import WalletBar from "@/components/wagmi/WalletBar";
import { AppLink } from "@/components/misc/AppLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = await params;
  const t = await getTranslations({ locale, namespace: "common.metadata" });

  return buildRootMetadata({
    locale,
    description: t("description"),
    keywords: t("keywords"),
  });
}

export const dynamic = "force-static";
export const revalidate = 600;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(lang => ({ lang }));
}

export const viewport: Viewport = {
  // Makes mobile browser scale to fit screen width instead of making the page 980px wide
  width: "device-width",
  // Don't scale initially
  initialScale: 1,
  // Good for accessibility scaling limit
  maximumScale: 5,
  // makes sure the viewport covers the entire screen on iOS, safe area is needed, make sure to add padding where appropriate
  viewportFit: "cover",
  // Makes sure the viewport resizes correctly when virtual keyboard appears
  interactiveWidget: "resizes-content",
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
  const gtmId = env.NEXT_PUBLIC_GTM_ID ?? "";
  const gtagEnabled = !!env.NEXT_PUBLIC_ENABLE_GTAG;
  const messages = await getMessages({ locale: lang });
  const tCommon = await getTranslations({ locale: lang, namespace: "common" });

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${fonts.DM_Sans.className} ${fonts.DM_mono.variable} pb-4 antialiased`}
    >
      {gtagEnabled && (
        <>
          <GoogleTagManager gtmId={gtmId} />
          <WebVitals />
        </>
      )}
      <body>
        <TooltipProvider delayDuration={200}>
          <NextIntlClientProvider messages={messages} locale={lang}>
            <ConnectionStatusTracker />
            <ToastProvider
              maxToastsToShow={3}
              defaultPosition="bottom-right"
              appearOnTop
              duration={1000 * 5}
            />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Providers locale={lang}>
                <Navbar
                  className="pt-safe sticky top-0 z-50"
                  logo={
                    <AppLink
                      href="/"
                      className="standard-focus-ring flex items-center gap-2 rounded-md p-1 select-none"
                    >
                      <Image src="/logo.svg?v=1" alt="Logo" width={32} height={32} />
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
                          disabled: true,
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
                <Container className="px-safe pb-safe">{children}</Container>
              </Providers>
            </ThemeProvider>
          </NextIntlClientProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

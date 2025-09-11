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
import { LocalizationProvider } from "@/components/localization/LocalizationProvider";
import { ThemeProvider } from "next-themes";
import { GoogleTagManager } from "@next/third-parties/google";
import { headers } from "next/headers";
import { nonceHeader } from "@/lib/nonce";
import { WebVitals } from "@/components/misc/WebVitals";
import Link from "@/components/shared/Link";
import ConnectButton from "@/components/wagmi/ConnectButton";
import ThemeSwitcher from "@/components/misc/ThemeSwitcher/index";
import Image from "next/image";
import { ClientNavigation } from "@/components/shared/ClientNavigation";
import { Navbar } from "@diffuse/ui-kit/Navbar";
import { Container } from "@diffuse/ui-kit/Container";
import ToastProvider from "@/components/toast";
import { ChainSwitcher } from "@/components/wagmi/ChainSwitcher";
import { TooltipProvider } from "@diffuse/ui-kit/Tooltip";
import { env } from "@/env";

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
  const gtmId = env.NEXT_PUBLIC_GTM_ID ?? "";
  const gtagEnabled = !!env.NEXT_PUBLIC_ENABLE_GTAG;

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${fonts.DM_Sans.className} ${fonts.DM_mono.variable} pb-4 antialiased`}
    >
      {gtagEnabled && (
        <>
          <GoogleTagManager gtmId={gtmId} nonce={nonce} />
          <WebVitals />
        </>
      )}
      <body>
        <TooltipProvider delayDuration={200}>
          <LocalizationProvider
            value={{
              lang,
              dictionary,
              dir,
            }}
          >
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
              nonce={nonce}
            >
              <Providers locale={lang}>
                <Navbar
                  className="sticky top-0 z-50"
                  logo={
                    <Link
                      href="/"
                      className="standard-focus-ring flex items-center gap-2 rounded-md p-1 select-none"
                      locale={lang}
                    >
                      <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                      <p className="text-secondary text-lg font-bold">
                        {dictionary.common.navbar.title}
                      </p>
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
                      <ChainSwitcher />
                      <ConnectButton />
                    </div>
                  }
                />
                <Container>{children}</Container>
              </Providers>
            </ThemeProvider>
          </LocalizationProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

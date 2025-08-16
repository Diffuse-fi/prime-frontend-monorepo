import type { Metadata } from "next";
import { Providers } from "../providers";
import { fonts } from "../fonts/fonts";
import "@rainbow-me/rainbowkit/styles.css";
import "../globals.css";
import { DEFAULT_LOCALE, Locale, RTL, SUPPORTED_LOCALES } from "@/lib/localization";
import defaultMeta from "../metadata";

export const metadata: Metadata = {
  ...defaultMeta,
};

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map(lang => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang = DEFAULT_LOCALE } = await params;
  const dir = RTL[lang] ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <body
        className={`${fonts.SFProText.variable} ${fonts.GeistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

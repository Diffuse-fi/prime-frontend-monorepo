import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";

const SFProText = localFont({
  src: [
    {
      path: "./sf-pro-text/sf-pro-text-regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./sf-pro-text/sf-pro-text-medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./sf-pro-text/sf-pro-text-semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./sf-pro-text/sf-pro-text-bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./sf-pro-text/sf-pro-text-light.woff",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-sf",
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
});

export const fonts = {
  SFProText,
  GeistMono,
};

export type Fonts = typeof fonts;

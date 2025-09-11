import localFont from "next/font/local";

const DM_Sans = localFont({
  src: [
    {
      path: "./dm-sans/DMSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});

const DM_mono = localFont({
  src: [
    {
      path: "./dm-mono/DMMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./dm-mono/DMMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./dm-mono/DMMono-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-dm-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

export const fonts = {
  DM_Sans,
  DM_mono,
};

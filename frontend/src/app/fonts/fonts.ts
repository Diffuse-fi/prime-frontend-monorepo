import localFont from "next/font/local";

const DM_Sans = localFont({
  src: [
    {
      path: "./dm-sans/DMSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./dm-sans/DMSans-ExtraLight.ttf",
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
      path: "./dm-mono/DMMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./dm-mono/DMMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./dm-mono/DMMono-Light.ttf",
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

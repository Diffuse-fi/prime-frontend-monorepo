import localFont from "next/font/local";

const DM_Sans = localFont({
  display: "swap",
  fallback: ["sans-serif"],
  preload: true,
  src: [
    {
      path: "./dm-sans/DMSans-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "./dm-sans/DMSans-Medium.ttf",
      style: "normal",
      weight: "500",
    },
    {
      path: "./dm-sans/DMSans-Bold.ttf",
      style: "normal",
      weight: "700",
    },
    {
      path: "./dm-sans/DMSans-Light.ttf",
      style: "normal",
      weight: "300",
    },
    {
      path: "./dm-sans/DMSans-ExtraBold.ttf",
      style: "normal",
      weight: "800",
    },
    {
      path: "./dm-sans/DMSans-SemiBold.ttf",
      style: "normal",
      weight: "600",
    },
    {
      path: "./dm-sans/DMSans-ExtraLight.ttf",
      style: "normal",
      weight: "200",
    },
  ],
  variable: "--font-dm-sans",
});

const DM_mono = localFont({
  display: "swap",
  fallback: ["monospace"],
  preload: true,
  src: [
    {
      path: "./dm-mono/DMMono-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "./dm-mono/DMMono-Medium.ttf",
      style: "normal",
      weight: "500",
    },
    {
      path: "./dm-mono/DMMono-Light.ttf",
      style: "normal",
      weight: "300",
    },
  ],
  variable: "--font-dm-mono",
});

export const fonts = {
  DM_mono,
  DM_Sans,
};

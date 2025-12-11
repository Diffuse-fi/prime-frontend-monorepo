import type { DeepPartial } from "utility-types";

import { darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash/merge";
import { useTheme } from "next-themes";

import { fonts } from "@/app/fonts/fonts";

const customFonts: DeepPartial<Theme> = {
  blurs: {
    modalOverlay: "blur(var(--blur-sm))",
  },
  colors: {
    closeButtonBackground: "color-mix(in oklab, var(--color-muted) 20%, transparent)",
    profileAction: "var(--color-border)",
    profileActionHover: "var(--color-border)",
    profileForeground: "var(--color-fg)",
  },
  // We just reuse variables defined by tailwindcss theme
  fonts: {
    body: fonts.DM_Sans.style.fontFamily,
  },
  shadows: {
    dialog: "var(--shadow-strong)",
  },
};

const rainbowLightTheme = merge(lightTheme(), customFonts);
const rainbowDarkTheme = merge(darkTheme(), customFonts);

export function useRainbowTheme(): Theme {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return isDark ? rainbowDarkTheme : rainbowLightTheme;
}

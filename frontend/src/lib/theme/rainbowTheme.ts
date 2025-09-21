import { darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import merge from "lodash/merge";
import { fonts } from "@/app/fonts/fonts";
import type { DeepPartial } from "utility-types";

const customFonts: DeepPartial<Theme> = {
  // We just reuse variables defined by tailwindcss theme
  fonts: {
    body: fonts.DM_Sans.style.fontFamily,
  },
  blurs: {
    modalOverlay: "blur(var(--blur-sm))",
  },
  colors: {
    profileForeground: "var(--color-fg)",
    profileAction: "var(--color-border)",
    profileActionHover: "var(--color-border)",
    closeButtonBackground: "color-mix(in oklab, var(--color-muted) 20%, transparent)",
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

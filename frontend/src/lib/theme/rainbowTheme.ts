import { darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import merge from "lodash/merge";
import { fonts } from "@/app/fonts/fonts";

const customFonts: Partial<Theme> = {
  fonts: {
    body: fonts.DM_Sans.style.fontFamily,
  },
};

const rainbowLightTheme = merge(lightTheme(), customFonts);
const rainbowDarkTheme = merge(darkTheme(), customFonts);

export function useRainbowTheme(): Theme {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return isDark ? rainbowDarkTheme : rainbowLightTheme;
}

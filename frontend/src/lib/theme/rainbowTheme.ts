import { darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";

const rainbowLightTheme = lightTheme({});
const rainbowDarkTheme = darkTheme({});

export function useRainbowTheme(): Theme {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return isDark ? rainbowDarkTheme : rainbowLightTheme;
}

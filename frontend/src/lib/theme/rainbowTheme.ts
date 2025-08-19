import { darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const rainbowLightTheme = lightTheme({});
const rainbowDarkTheme = darkTheme({});

export function useRainbowTheme(): Theme {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return useMemo(() => (isDark ? rainbowDarkTheme : rainbowLightTheme), [isDark]);
}

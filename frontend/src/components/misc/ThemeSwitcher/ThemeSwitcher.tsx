import { IconButton } from "@diffuse/ui-kit";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { setTheme, systemTheme, theme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  return (
    <IconButton
      aria-label={current === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={current === "dark"}
      icon={current === "dark" ? <Sun /> : <Moon />}
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      size="sm"
      variant="ghost"
    />
  );
}

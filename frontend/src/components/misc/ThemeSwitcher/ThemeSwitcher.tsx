import { IconButton } from "@diffuse/ui-kit";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  return (
    <IconButton
      aria-label={current === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={current === "dark"}
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      icon={current === "dark" ? <Sun /> : <Moon />}
      size="sm"
      variant="ghost"
    />
  );
}

import { IconButton } from "@diffuse/ui-kit";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  return (
    <IconButton
      aria-label="Toggle site theme"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      icon={current === "dark" ? <Sun /> : <Moon />}
      size="sm"
    />
  );
}

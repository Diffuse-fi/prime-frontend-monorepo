import { IconButton } from "@diffuse/ui-kit";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;
  const t = useTranslations("common.accessibility");

  return (
    <IconButton
      aria-label={t("switchToTheme", { theme: current === "dark" ? "light" : "dark" })}
      aria-pressed={current === "dark"}
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      icon={current === "dark" ? <Sun /> : <Moon />}
      size="sm"
      variant="ghost"
    />
  );
}

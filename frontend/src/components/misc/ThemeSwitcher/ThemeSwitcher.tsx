import { useLocalization } from "@/lib/localization/useLocalization";
import { IconButton, Tooltip } from "@diffuse/ui-kit";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;
  const { dict } = useLocalization();

  return (
    <Tooltip side="bottom" content={dict.lend.tooltips.toggleTheme}>
      <IconButton
        aria-label=""
        onClick={() => setTheme(current === "dark" ? "light" : "dark")}
        icon={current === "dark" ? <Sun /> : <Moon />}
        size="sm"
        variant="solid"
        aria-hidden
        className="animate-in-fade"
      />
    </Tooltip>
  );
}

import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  return (
    <button
      aria-label="Toggle theme"
      className="inline-flex items-center rounded-xl px-3 py-2 border border-border"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
    >
      {current === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

import type { Config } from "tailwindcss";

const preset = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--ui-bg)",
        fg: "var(--ui-fg)",
        border: "var(--ui-border)",
        muted: "var(--ui-muted)",
        primary: "var(--ui-primary)",
        "primary-fg": "var(--ui-primary-fg)",
        success: "var(--ui-success)",
        warning: "var(--ui-warning)",
        danger: "var(--ui-danger)",
      },
      borderRadius: {
        sm: "var(--ui-radius-sm)",
        DEFAULT: "var(--ui-radius)",
        md: "var(--ui-radius-md)",
        lg: "var(--ui-radius-lg)",
        xl: "var(--ui-radius-xl)",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,.12)",
      },
      keyframes: {
        "in-zoom": {
          from: { opacity: "0", transform: "scale(.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "out-zoom": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(.96)" },
        },
        "in-fade": { from: { opacity: "0" }, to: { opacity: "1" } },
        "out-fade": { from: { opacity: "1" }, to: { opacity: "0" } },
      },
      animation: {
        "in-zoom": "in-zoom .14s ease-out",
        "out-zoom": "out-zoom .12s ease-in",
        "in-fade": "in-fade .14s ease-out",
        "out-fade": "out-fade .12s ease-in",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ":root": {
          "--ui-bg": "#0b0b12",
          "--ui-fg": "#e7e7ec",
          "--ui-border": "#2a2a35",
          "--ui-muted": "#9aa0a6",
          "--ui-primary": "#6d5efc",
          "--ui-primary-fg": "#0b0b12",
          "--ui-success": "#22c55e",
          "--ui-warning": "#f59e0b",
          "--ui-danger": "#ef4444",
          "--ui-radius-sm": "6px",
          "--ui-radius": "10px",
          "--ui-radius-md": "12px",
          "--ui-radius-lg": "14px",
          "--ui-radius-xl": "18px",
        },
        ".dark": {
          "--ui-bg": "#0a0a0a",
          "--ui-fg": "#fafafa",
          "--ui-border": "#2f2f2f",
          "--ui-muted": "#a1a1aa",
          "--ui-primary": "#7c7cff",
          "--ui-primary-fg": "#0a0a0a",
        },
      });
    },
  ],
} as const satisfies Config;

export default preset;

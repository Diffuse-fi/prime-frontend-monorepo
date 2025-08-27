import type { Config } from "tailwindcss";
import { BasePlugin } from "./plugins";

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
  plugins: [BasePlugin],
} as const satisfies Config;

export default preset;

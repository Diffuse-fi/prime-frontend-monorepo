import { PluginCreator } from "tailwindcss/plugin";

export const BasePlugin: PluginCreator = ({ addBase }) => {
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
};

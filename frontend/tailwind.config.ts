import type { Config } from "tailwindcss";
import uiKitPreset from "@diffuse/ui-kit/tw-preset";

const config: Config = {
  darkMode: "class",
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [uiKitPreset],
};

export default config;

import type { Config } from "tailwindcss";

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
};

export default config;

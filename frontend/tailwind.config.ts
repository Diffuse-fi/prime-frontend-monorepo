import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
};

export default config;

/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{tsx,ts}",
  outDir: "build-ladle",
  addons: {
    theme: {
      enabled: true,
      defaultState: "dark",
    },
  },
  viteConfig: "./vite.config.ts",
};

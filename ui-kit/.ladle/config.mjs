/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{tsx,jsx}",
  outDir: "build-ladle",
  addons: {
    theme: {
      enabled: true,
      defaultState: "light",
    },
  },
  viteConfig: "./vite.config.ts",
};

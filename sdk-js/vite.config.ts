import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json" with { type: "json" };
import { externalizeDeps } from "vite-plugin-externalize-deps";

const __dirname = dirname(fileURLToPath(import.meta.url));

const banner = `
/**
* ${packageJson.name} v${packageJson.version}
*/`;

export default defineConfig(() => {
  const plugins = [
    tsconfigPaths(),
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
    }),
    externalizeDeps({
      deps: true,
      peerDeps: true,
    }),
  ];

  return {
    tsconfig: "tsconfig.json",
    plugins,
    build: {
      outDir: "dist",
      minify: true,
      sourcemap: true,
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        formats: ["es"],
        fileName: "diffuse-prime-sdk-js.mjs",
      },
      rollupOptions: {
        output: {
          banner: chunk => {
            return chunk.isEntry ? banner : "";
          },
        },
      },
      terserOptions: {
        keep_classnames: true,
      },
    },
  };
});

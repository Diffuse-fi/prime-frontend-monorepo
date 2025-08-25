import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));

const banner = `
/**
* ${packageJson.name} v${packageJson.version}
*/`;

const getFileName = (format: string) => {
  switch (format) {
    case "es":
      return "diffuse-prime-ui-kit.mjs";
    case "cjs":
      return "diffuse-prime-ui-kit.js";
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

export default defineConfig(() => {
  const plugins = [
    tsconfigPaths(),
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ];

  return {
    plugins,
    build: {
      outDir: "dist",
      minify: true,
      sourcemap: true,
      emptyOutDir: true,
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        formats: ["es", "cjs"],
        fileName: getFileName,
      },
      rollupOptions: {
        output: {
          banner: chunk => {
            return chunk.isEntry ? banner : "";
          },
        },
        external: [
          ...Object.keys(packageJson.peerDependencies || {}),
        ],
      },
    },
  };
});

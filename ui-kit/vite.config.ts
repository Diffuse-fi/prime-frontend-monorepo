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

const getFileName = (format: string, entryName: string) => {
  if (format !== "es" && format !== "cjs") {
    throw new Error(`Unsupported format: ${format}`);
  }

  const ext = format === "es" ? "mjs" : "cjs";

  if (entryName === "index") {
    return `diffuse-prime-ui-kit.${ext}`;
  }

  return `${entryName}.${ext}`;
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
      minify: false,
      sourcemap: true,
      emptyOutDir: true,
      lib: {
        entry: {
          index: resolve(__dirname, "src/index.ts"),
          "tailwind.preset": resolve(__dirname, "src/theme/tailwind.preset.ts"),
        },
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

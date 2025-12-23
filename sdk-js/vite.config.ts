import path, { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, Plugin, UserConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json" with { type: "json" };
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { generateAbis } from "./generateAbis";

const __dirname = dirname(fileURLToPath(import.meta.url));

const banner = `
/**
* ${packageJson.name} v${packageJson.version}
*/`;

function abiGeneratorPlugin(contractsRoot: string): Plugin {
  const isAbiJson = (id: string) =>
    id.endsWith(`${path.sep}abi.json`) &&
    id.includes(`${path.sep}src${path.sep}contracts${path.sep}`);

  return {
    name: "diffuse:abi-generator",
    enforce: "pre",
    async buildStart() {
      const { readdir } = await import("node:fs/promises");

      const dirs = (await readdir(contractsRoot, { withFileTypes: true }))
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const dir of dirs) {
        this.addWatchFile(path.join(contractsRoot, dir, "abi.json"));
      }
    },
    async watchChange(id) {
      if (isAbiJson(id)) await generateAbis(contractsRoot);
    },
  };
}

export default defineConfig(async (): Promise<UserConfig> => {
  const contractsRoot = resolve(__dirname, "src/contracts");
  await generateAbis(contractsRoot);

  const plugins = [
    abiGeneratorPlugin(contractsRoot),
    tsconfigPaths({
      projects: [resolve(__dirname, "tsconfig.build.json")],
    }),
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
    plugins,
    build: {
      outDir: "dist",
      minify: true,
      sourcemap: true,
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        formats: ["es"],
        fileName: () => "diffuse-prime-sdk-js.mjs",
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

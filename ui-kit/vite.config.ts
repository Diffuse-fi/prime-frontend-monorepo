import { dirname, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, Plugin } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json" with { type: "json" };
import fg from "fast-glob";
import { readFileSync } from "node:fs";
import tailwind from "@tailwindcss/vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";

const __dirname = dirname(fileURLToPath(import.meta.url));

const banner = `
/**
* ${packageJson.name} v${packageJson.version}
*/`;

const getFileName = (_: string, entryName: string) => {
  const ext = "mjs";

  if (entryName === "index") {
    return `diffuse-prime-ui-kit.${ext}`;
  }

  return `${entryName}.${ext}`;
};

function presetCssAsset(): Plugin {
  const presetPath = resolve(__dirname, "src/theme/preset.css");

  return {
    name: "watch-preset-css",
    buildStart() {
      this.addWatchFile(presetPath);
    },
    generateBundle() {
      const css = readFileSync(presetPath, "utf8");

      this.emitFile({
        type: "asset",
        fileName: "preset.css",
        name: "preset.css",
        source: css,
      });
    },
  };
}

const discoverComponentEntries = () => {
  const components = fg.sync(["src/components/**/*.tsx"], {
    absolute: true,
    onlyFiles: true,
    ignore: [
      "**/__tests__/**",
      "**/test/**",
      "**/*.test.*",
      "**/*.spec.*",
      "**/index.ts",
      "**/index.tsx",
      "**/types.ts",
      "**/*.stories.tsx",
    ],
  });

  const helpers = fg.sync(["src/lib/**/*.ts"], {
    absolute: true,
    onlyFiles: true,
    ignore: ["**/*.test.*", "**/*.spec.*", "**/index.ts"],
  });

  const files = [...components, ...helpers];

  const entries: Record<string, string> = {};
  const dupes: Record<string, string[]> = {};

  for (const abs of files) {
    const base = basename(abs, extname(abs));

    if (entries[base]) {
      dupes[base] = dupes[base] ? [...dupes[base], abs] : [entries[base], abs];
    } else {
      entries[base] = abs;
    }
  }

  if (Object.keys(dupes).length) {
    const msg = Object.entries(dupes)
      .map(([name, list]) => `- ${name}\n  ${list.join("\n  ")}`)
      .join("\n");

    throw new Error(
      `Duplicate component basenames detected:\n${msg}\nRename to avoid collisions.`
    );
  }

  return entries;
};

export default defineConfig(() => {
  const componentEntries = discoverComponentEntries();
  const isWatch = process.argv.includes("--watch") || process.env.BUILD_WATCH === "1";

  const plugins = [
    tsconfigPaths(),
    dts({
      entryRoot: resolve(__dirname, "src"),
      rollupTypes: true,
      insertTypesEntry: true,
      exclude: ["**/*.test.*", "**/__tests__/**"],
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
    }),
    presetCssAsset(),
    tailwind(),
    externalizeDeps({
      deps: true,
      peerDeps: true,
    }),
  ];

  return {
    plugins,
    build: {
      outDir: "dist",
      minify: false,
      sourcemap: true,
      emptyOutDir: !isWatch,
      lib: {
        entry: {
          index: resolve(__dirname, "src/index.ts"),
          ...componentEntries,
        },
        formats: ["es"],
        fileName: getFileName,
      },
      rollupOptions: {
        output: {
          banner: chunk => {
            return chunk.isEntry ? banner : "";
          },
        },
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }

          warn(warning);
        },
      },
    },
  };
});

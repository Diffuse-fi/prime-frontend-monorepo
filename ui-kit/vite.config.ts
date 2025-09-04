import { dirname, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json" with { type: "json" };
import fg from "fast-glob";

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

const discoverComponentEntries = () => {
  const files = fg.sync(["src/components/**/*.tsx"], {
    absolute: true,
    onlyFiles: true,
    ignore: [
      "**/__tests__/**",
      "**/test/**",
      "**/*.test.*",
      "**/*.spec.*",
      "**/index.ts",
      "**/index.tsx",
    ],
  });

  const entries: Record<string, string> = {};
  const dupes: Record<string, string[]> = {};

  console.log("Discovered component entries:", files);

  for (const abs of files) {
    const base = basename(abs, extname(abs)); // e.g. Button
    // Heuristic: only treat PascalCase as component entries
    if (!/^[A-Z]/.test(base)) continue;

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

  const plugins = [
    tsconfigPaths(),
    dts({
      entryRoot: resolve(__dirname, "src"),
      rollupTypes: true,
      insertTypesEntry: true,
      exclude: ["**/*.test.*", "**/__tests__/**"],
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
          ...componentEntries,
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

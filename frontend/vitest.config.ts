import { fileURLToPath } from "node:url";

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const resolveAlias = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: [
      {
        find: /^@diffuse\/config$/,
        replacement: resolveAlias("../config/src/index.ts"),
      },
      {
        find: /^@diffuse\/ui-kit$/,
        replacement: resolveAlias("../ui-kit/src/index.ts"),
      },
      {
        find: /^@diffuse\/ui-kit\/cn$/,
        replacement: resolveAlias("../ui-kit/src/lib/cn.ts"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
    setupFiles: ["./tests/unit/unitTestSetupFile.ts"],
    coverage: {
      provider: "v8",
      reporter: ["json", "text", "lcov", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/index.{ts,tsx}"],
      reportsDirectory: "coverage",
      thresholds: {
        // TODO adjust thresholds when tests are added
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
      reportOnFailure: true,
    },
  },
});

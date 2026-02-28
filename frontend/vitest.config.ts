import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  plugins: [tsconfigPaths()],
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

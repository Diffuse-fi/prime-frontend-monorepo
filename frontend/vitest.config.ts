import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
    setupFiles: ["./tests/unit/unitTestSetupFile.ts"],
    env: {
      // Provide required env vars for tests
      NEXT_PUBLIC_APP_NAME: "Test App",
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: "test-project-id",
      NEXT_PUBLIC_INITIAL_CHAIN_ID: "1",
      NEXT_PUBLIC_APP_DESCRIPTION: "Test Description",
      ORIGIN: "http://localhost:3000",
      INDEXER_DATABASE_URL: "postgres://test:test@localhost:5432/test",
      CRON_SECRET: "test-secret",
    },
  },
});

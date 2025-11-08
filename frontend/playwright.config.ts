import { defineConfig, devices } from "@playwright/test";

const isCI = /^(1|true)$/i.test(process.env.CI ?? "");
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

const WORKERS = Number(process.env.E2E_WORKERS ?? (isCI ? 2 : 4));
const RETRIES = Number(process.env.E2E_RETRIES ?? (isCI ? 2 : 1));
const OPEN_REPORT =
  (process.env.E2E_OPEN_REPORT as "never" | "on-failure" | "always") ?? "never";

export default defineConfig({
  testDir: "./tests/e2e",
  retries: RETRIES,
  workers: WORKERS,
  snapshotDir: "tests/e2e/output/snapshots",
  outputDir: "tests/e2e/output/test-results",
  fullyParallel: true,
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Microsoft Edge",
      use: { ...devices["Desktop Edge"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 15"] },
    },
  ],
  reporter: [
    [
      "html",
      {
        open: OPEN_REPORT,
        outputFolder: "tests/e2e/output/playwright-report",
      },
    ],
    ["list"],
  ],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !isCI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 120 * 1000,
  },
});

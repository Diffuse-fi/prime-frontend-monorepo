import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import playwright from "eslint-plugin-playwright";
import vitest from "@vitest/eslint-plugin";
import testingLibrary from "eslint-plugin-testing-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const nextCompat = compat.config({
  extends: ["next/typescript", "next/core-web-vitals"],
  settings: { next: { rootDir: ["frontend"] } },
});

const nextScoped = nextCompat.map(c => ({
  files: ["frontend/src/**/*.{ts,tsx}"],
  ...c,
}));

export default [
  ...nextScoped,
  {
    plugins: { playwright },
    ...playwright.configs["flat/recommended"],
    files: ["**/tests/e2e/**/*.ts", "**/tests/e2e/**/*.tsx"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    ignores: ["**/tests/e2e/**/*.ts", "**/tests/e2e/**/*.tsx"],
    ...vitest.configs["recommended"],
    plugins: { vitest, "testing-library": testingLibrary },
    rules: {
      ...vitest.configs["recommended"].rules,
      ...testingLibrary.configs["react"].rules,
      "testing-library/no-node-access": "error",
      "vitest/no-focused-tests": "error",
      "vitest/valid-expect": "error",
      "vitest/max-nested-describe": [
        "error",
        {
          max: 3,
        },
      ],
      "vitest/prefer-lowercase-title": [
        "error",
        {
          ignore: ["describe"],
        },
      ],
    },
  },
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/coverage/",
      "**/build",
      "**/out",
      "**/public",
      "**/frontend/src/dictionaries/*.json",
      "**/.next/**",
      "**/.lighthouseci/**",
      "**/drizzle/**",
      "**/e2e/output/**",
    ],
  },
];

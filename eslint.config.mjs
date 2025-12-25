import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import playwright from "eslint-plugin-playwright";
import vitest from "@vitest/eslint-plugin";
import testingLibrary from "eslint-plugin-testing-library";
import perfectionist from "eslint-plugin-perfectionist";
import unicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";
import * as regexpPlugin from "eslint-plugin-regexp";
import promisePlugin from "eslint-plugin-promise";
import security from "eslint-plugin-security";
import noSecrets from "eslint-plugin-no-secrets";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

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
  files: ["frontend/src/**/*.{ts,tsx}", "frontend/tests/**/*.{ts,tsx}"],
  ...c,
}));

const frontendSrc = ["frontend/src/**/*.{ts,tsx}", "frontend/scripts/**/*.ts"];
const uiKitSrc = ["ui-kit/src/**/*.{ts,tsx}"];
const sdkSrc = ["sdk-js/src/**/*.ts"];
const indexerSrc = ["indexer/src/**/*.ts"];
const configSrc = ["config/src/**/*.ts", "config/scripts/**/*.ts"];
const scriptsSrc = ["scripts/**/*.ts"];

const allTsFiles = [
  ...frontendSrc,
  ...uiKitSrc,
  ...sdkSrc,
  ...indexerSrc,
  ...configSrc,
  ...scriptsSrc,
];

const tsConfigs = tseslint.configs.recommended.map(config => ({
  ...config,
  files: allTsFiles,
}));

export default [
  ...nextScoped,
  ...tsConfigs,
  {
    files: allTsFiles,
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],
    },
  },
  {
    ...perfectionist.configs["recommended-natural"],
    files: allTsFiles,
    rules: {
      ...perfectionist.configs["recommended-natural"].rules,
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "type",
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "unknown",
          ],
        },
      ],
    },
  },
  {
    ...unicorn.configs["recommended"],
    files: allTsFiles,
    rules: {
      ...unicorn.configs["recommended"].rules,
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
            kebabCase: true,
          },
        },
      ],
      "unicorn/no-array-sort": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-null": "off",
      "unicorn/no-nested-ternary": "warn",
      "unicorn/import-style": "off",
    },
  },
  {
    ...sonarjs.configs.recommended,
    files: allTsFiles,
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/todo-tag": "warn",
      "sonarjs/no-nested-functions": "warn",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/no-nested-template-literals": "off",
    },
  },
  {
    ...regexpPlugin.configs["flat/recommended"],
    files: allTsFiles,
  },
  {
    ...promisePlugin.configs["flat/recommended"],
    files: allTsFiles,
  },
  {
    files: frontendSrc,
    plugins: {
      security,
      "no-secrets": noSecrets,
    },
    rules: {
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "error",
      "no-secrets/no-secrets": "error",
      "security/detect-object-injection": "off",
    },
  },
  {
    plugins: { playwright },
    ...playwright.configs["flat/recommended"],
    files: ["frontend/tests/e2e/**/*.ts", "frontend/tests/e2e/**/*.tsx"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
    },
  },
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],
    ignores: ["frontend/tests/e2e/**/*.ts", "frontend/tests/e2e/**/*.tsx"],
    ...vitest.configs["recommended"],
    plugins: { vitest, "testing-library": testingLibrary },
    rules: {
      ...vitest.configs["recommended"].rules,
      ...testingLibrary.configs.react.rules,
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
    files: scriptsSrc,
    ...jsdoc.configs["flat/recommended"],
    rules: {
      "jsdoc/require-file-overview": "error",
    },
    ignores: ["scripts/utils/**"],
  },
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/coverage/",
      "**/build",
      "**/out",
      "**/public",
      "frontend/src/dictionaries/*.json",
      "**/.next/**",
      "**/.lighthouseci/**",
      "**/drizzle/**",
      "frontend/e2e/output/**",
      "sdk-js/**/abi.ts",
    ],
  },
];

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/typescript", "next/core-web-vitals"],
    settings: {
      next: {
        rootDir: "frontend",
      },
    },
  }),
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/coverage/",
      "**/build",
      "**/out",
      "**/public",
      "**/frontend/src/dictionaries/*.json",
      "**/frontend/next-sitemap.config.js",
    ],
  },
];

export default eslintConfig;

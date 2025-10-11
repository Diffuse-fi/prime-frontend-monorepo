import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

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
  files: ["frontend/**/*.{ts,tsx}"],
  ...c,
}));

export default [
  ...nextScoped,
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
    ],
  },
];

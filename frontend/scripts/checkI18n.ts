import { spawnSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type LocalizationSettings = {
  default: string;
};

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDir, "..");
const dictionariesDir = resolve(frontendRoot, "src", "dictionaries");
const localizationPath = resolve(frontendRoot, "src", "localization.json");
const srcPath = resolve(frontendRoot, "src");
const allowedExtensions = new Set([".json", ".yaml", ".yml"]);

const localization = JSON.parse(
  await readFile(localizationPath, "utf8")
) as LocalizationSettings;
const sourceLocale = localization.default;

const localeFiles = (await readdir(dictionariesDir, { withFileTypes: true }))
  .filter(entry => entry.isFile())
  .map(entry => entry.name)
  .filter(name => allowedExtensions.has(extname(name)));

if (localeFiles.length === 0) {
  throw new Error(`No locale files found in ${dictionariesDir}`);
}

if (!localeFiles.some(name => name.startsWith(`${sourceLocale}.`))) {
  throw new Error(
    `Missing source locale "${sourceLocale}" in ${dictionariesDir}. Add ${sourceLocale}.json or update src/localization.json.`
  );
}

const binName = process.platform === "win32" ? "i18n-check.cmd" : "i18n-check";
const binPath = resolve(frontendRoot, "..", "node_modules", ".bin", binName);

const result = spawnSync(
  binPath,
  [
    "--locales",
    dictionariesDir,
    "--source",
    sourceLocale,
    "--unused",
    srcPath,
    "--format",
    "next-intl",
  ],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);

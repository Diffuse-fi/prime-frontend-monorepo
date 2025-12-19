/**
 * @file
 *
 * This script checks that all production dependencies in all workspace packages
 * use only approved open-source licenses to ensure compliance and security.
 */

import { execSync } from "node:child_process";
import path from "node:path";

import { listWorkspaceDirs, readJSON } from "./utils/workspaceUtils";

type WsPkg = { name?: string };

const APPROVED = new Set([
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "CC0-1.0",
  "ISC",
  "MIT",
  "Unlicense",
]);

function checkOne(cwd: string, label: string, wsNames: Set<string>) {
  const cmd = "npx";
  const args = ["license-checker-rseidelsohn", "--production", "--json"];

  // eslint-disable-next-line sonarjs/os-command
  const out = execSync([cmd, ...args].join(" "), {
    cwd,
    env: process.env,
    stdio: ["ignore", "pipe", "inherit"],
  }).toString();

  const data = JSON.parse(out) as Record<string, { licenses: string | string[] }>;

  const violations: Array<{ license: string | string[]; pkg: string }> = [];

  for (const [key, info] of Object.entries(data)) {
    const pkgName = parsePkgNameFromKey(key);

    if (wsNames.has(pkgName)) continue;

    const raw = info.licenses;
    const list = Array.isArray(raw) ? raw : [raw];
    const ok = list.some(lic => APPROVED.has(String(lic)));
    if (!ok) violations.push({ license: raw, pkg: key });
  }

  if (violations.length > 0) {
    throw new Error(
      `[licenses] ${label} has non-approved third-party licenses:\n` +
        violations.map(v => `  - ${v.pkg}: ${String(v.license)}`).join("\n")
    );
  }
}

function getWorkspaceNames(wsDirs: string[]): Set<string> {
  const names = new Set<string>();
  for (const dir of wsDirs) {
    const pj = readJSON<WsPkg>(path.join(dir, "package.json"));
    if (pj.name) names.add(pj.name);
  }
  return names;
}

function main() {
  const wsDirs = listWorkspaceDirs();
  const wsNames = getWorkspaceNames(wsDirs);

  for (const dir of wsDirs) {
    const pj = readJSON<WsPkg>(path.join(dir, "package.json"));
    checkOne(dir, pj.name ?? dir, wsNames);
  }
}

function parsePkgNameFromKey(key: string): string {
  if (key.startsWith("@")) {
    const secondAt = key.indexOf("@", 1);
    return key.slice(0, secondAt);
  }
  const at = key.lastIndexOf("@");
  return at > 0 ? key.slice(0, at) : key;
}

main();

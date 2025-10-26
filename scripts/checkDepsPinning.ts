/**
 * Script to check that all production dependencies in all workspaces
 * are pinned to specific versions (no ^ or ~) for security purposes.
 */

import path from "node:path";
import { listWorkspaceDirs, readJSON } from "./utils/getWorkspaceDirs";

type PkgJson = {
  name?: string;
  private?: boolean;
  workspaces?: string[] | { packages?: string[] };
  dependencies?: Record<string, string>;
};

function main() {
  const pkgs = listWorkspaceDirs();
  let failed = false;

  for (const dir of pkgs) {
    const pjPath = path.join(dir, "package.json");
    const pj = readJSON<PkgJson>(pjPath);
    const prod = Object.entries(pj.dependencies ?? {});
    for (const [name, range] of prod) {
      if (/^[~^]/.test(range)) {
        console.error(
          `[pinning] ${pj.name ?? dir}: dependencies.${name} uses range "${range}"`
        );
        failed = true;
      }
    }
  }

  if (failed) process.exit(1);
}

main();

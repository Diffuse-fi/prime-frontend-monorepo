/**
 * Script to check that all workspace packages use the current versions
 * of other workspace packages from the monorepo.
 */

import path from "node:path";
import { listWorkspaceDirs, readJSON } from "./utils/workspaceUtils";

type PkgJson = {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
};

function main() {
  const wsDirs = listWorkspaceDirs();
  let failed = false;

  const wsVersions = new Map<string, { version: string; dir: string }>();
  for (const dir of wsDirs) {
    const pjPath = path.join(dir, "package.json");
    const pj = readJSON<PkgJson>(pjPath);
    if (pj.name && pj.version) {
      wsVersions.set(pj.name, { version: pj.version, dir });
    }
  }

  for (const dir of wsDirs) {
    const pjPath = path.join(dir, "package.json");
    const pj = readJSON<PkgJson>(pjPath);

    if (!pj.dependencies) continue;

    for (const [depName, depVersion] of Object.entries(pj.dependencies)) {
      const wsInfo = wsVersions.get(depName);
      if (wsInfo && depVersion !== wsInfo.version) {
        console.error(
          `[sync] ${pj.name ?? dir}: dependency "${depName}" is version "${depVersion}" but should be "${wsInfo.version}"`
        );
        failed = true;
      }
    }
  }

  if (failed) {
    console.error(
      "\nTo fix: Update the dependency versions in the package.json files to match the workspace package versions."
    );
    process.exit(1);
  }
}

main();

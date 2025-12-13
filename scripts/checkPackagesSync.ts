/**
 * Script to check that all workspace packages use the current versions
 * of other workspace packages from the monorepo.
 */

import path from "node:path";

import { listWorkspaceDirs, readJSON } from "./utils/workspaceUtils";

type PkgJson = {
  dependencies?: Record<string, string>;
  name?: string;
  version?: string;
};

function main() {
  const wsDirs = listWorkspaceDirs();
  let failed = false;

  const wsVersions = new Map<string, { dir: string; version: string }>();
  for (const dir of wsDirs) {
    const pjPath = path.join(dir, "package.json");
    const pj = readJSON<PkgJson>(pjPath);
    if (pj.name && pj.version) {
      wsVersions.set(pj.name, { dir, version: pj.version });
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
    throw new Error("Package versions are not synchronized");
  }
}

main();

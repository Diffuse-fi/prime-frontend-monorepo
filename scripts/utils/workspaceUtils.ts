import fs from "node:fs";
import path from "node:path";

type RootPkg = {
  workspaces?: string[] | { packages?: string[] };
};

export function listWorkspaceDirs(): string[] {
  const root = readJSON<RootPkg>(path.resolve("package.json"));
  const patterns = getWorkspacePatterns(root);
  return patterns.flatMap(w => expandWorkspacePattern(w));
}

export function readJSON<T = unknown>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

function expandWorkspaceGlob(pattern: string): string[] {
  const base = pattern.slice(0, -2);
  if (!fs.existsSync(base)) return [];
  const entries = fs.readdirSync(base);
  const dirs: string[] = [];
  for (const name of entries) {
    const full = path.join(base, name);
    if (fs.existsSync(path.join(full, "package.json"))) dirs.push(full);
  }
  return dirs;
}

function expandWorkspacePattern(pattern: string): string[] {
  if (pattern.endsWith("/*")) return expandWorkspaceGlob(pattern);
  return workspaceDirIfExists(pattern);
}

function getWorkspacePatterns(root: RootPkg): string[] {
  if (Array.isArray(root.workspaces)) return root.workspaces;
  return root.workspaces?.packages ?? [];
}

function workspaceDirIfExists(pat: string): string[] {
  if (fs.existsSync(path.join(pat, "package.json"))) return [pat];
  return [];
}

import fs from "node:fs";
import path from "node:path";

type RootPkg = {
  workspaces?: string[] | { packages?: string[] };
};

export function readJSON<T = unknown>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

export function listWorkspaceDirs(): string[] {
  const root = readJSON<RootPkg>(path.resolve("package.json"));
  const ws = Array.isArray(root.workspaces)
    ? root.workspaces
    : (root.workspaces?.packages ?? []);

  const dirs: string[] = [];
  for (const pat of ws) {
    if (pat.endsWith("/*")) {
      const base = pat.slice(0, -2);
      if (!fs.existsSync(base)) continue;
      for (const name of fs.readdirSync(base)) {
        const full = path.join(base, name);
        if (fs.existsSync(path.join(full, "package.json"))) dirs.push(full);
      }
    } else {
      if (fs.existsSync(path.join(pat, "package.json"))) dirs.push(pat);
    }
  }
  return dirs;
}

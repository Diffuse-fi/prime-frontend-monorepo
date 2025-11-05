import fs from "node:fs";
import path from "node:path";
import { execFile as _execFile } from "node:child_process";
import { promisify } from "node:util";
import { listWorkspaceDirs } from "./utils/workspaceUtils";

const execFile = promisify(_execFile);

const ROOT = process.cwd();
const TARGETS = [ROOT, ...listWorkspaceDirs()];

async function rmTarget(p: string) {
  const pkgJson = path.join(p, "package.json");
  if (!fs.existsSync(pkgJson)) return;

  const nm = path.join(p, "node_modules");
  const plock = path.join(p, "package-lock.json");

  const ops: Promise<any>[] = [];

  if (fs.existsSync(nm)) {
    ops.push(
      fs.promises
        .rm(nm, { recursive: true, force: true })
        .then(() => console.log(`removed ${path.relative(ROOT, nm)}`))
    );
  }
  if (fs.existsSync(plock)) {
    ops.push(
      fs.promises
        .rm(plock, { force: true })
        .then(() => console.log(`removed ${path.relative(ROOT, plock)}`))
    );
  }

  if (ops.length === 0) {
    console.log(`nothing to remove in ${path.relative(ROOT, p) || "."}`);
  }

  await Promise.all(ops);
}

async function main() {
  console.log("== Clean install ==");
  console.log(`Workspaces: ${TARGETS.length - 1}`);
  const concurrency = 8;
  const queue = TARGETS.slice();
  const workers: Promise<void>[] = [];

  for (let i = 0; i < concurrency; i++) {
    workers.push(
      (async function run() {
        while (queue.length) {
          const next = queue.shift()!;
          await rmTarget(next);
        }
      })()
    );
  }

  await Promise.all(workers);

  console.log("installing dependencies...");

  await execFile("npm", ["install"], { cwd: ROOT, env: process.env, shell: false })
    .then(({ stdout, stderr }) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    })
    .catch(err => {
      console.error("npm install failed:", err.message || err);
      process.exitCode = 1;
    });

  console.log("clean install complete");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

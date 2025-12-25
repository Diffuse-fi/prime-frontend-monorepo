import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const frontendDir = path.join(scriptDir, "..");
const buildPath = path.join(frontendDir, ".next");

try {
  const stat = statSync(buildPath);
  const isDirectory = stat.isDirectory();
  const notEmpty = readdirSync(buildPath).some(name => !name.startsWith("."));
  const canSkipBuild = isDirectory && notEmpty;

  if (canSkipBuild) {
    console.info(".next exists, skipping build");
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  } else {
    console.info(".next does not exist or empty, building...");
  }
} catch {
  console.info(".next does not exist or empty, building...");
}

// eslint-disable-next-line sonarjs/no-os-command-from-path
execSync("npm run build", { cwd: frontendDir, stdio: "inherit" });

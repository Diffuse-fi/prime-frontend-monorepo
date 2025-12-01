import { execSync } from "child_process";
import { readdirSync, statSync } from "fs";
import path from "path";

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const frontendDir = path.join(scriptDir, "..");
const buildPath = path.join(frontendDir, ".next");

try {
  const stat = statSync(buildPath);
  const isDirectory = stat.isDirectory();
  const notEmpty =
    readdirSync(buildPath).filter(name => !name.startsWith(".")).length > 0;
  const canSkipBuild = isDirectory && notEmpty;

  if (canSkipBuild) {
    console.log(".next exists, skipping build");
    process.exit(0);
  } else {
    console.log(".next does not exist or empty, building...");
  }
} catch {
  console.log(".next does not exist or empty, building...");
}

execSync("npm run build", { stdio: "inherit", cwd: frontendDir });

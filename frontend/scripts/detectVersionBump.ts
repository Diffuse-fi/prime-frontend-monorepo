import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function arg(name: string) {
  const i = process.argv.indexOf(name);
  if (i === -1) return;

  return process.argv[i + 1];
}

function existsRefFile(refFile: string) {
  try {
    // eslint-disable-next-line sonarjs/os-command
    execSync(`git cat-file -e ${refFile}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function run(cmd: string) {
  // eslint-disable-next-line sonarjs/os-command
  return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function setOutput(key: string, value: string) {
  const line = `${key}=${value}\n`;
  const out = process.env.GITHUB_OUTPUT;
  if (out) fs.appendFileSync(out, line);
  else process.stdout.write(line);
}

const pkgPath = path.join(process.cwd(), "package.json");
const curr = JSON.parse(fs.readFileSync(pkgPath, "utf8")).version as string;

const before = arg("--before");
const missingPrev = arg("--missing-prev") ?? "release";

let prev = "";

const sha = before && /^[0-9a-f]{7,40}$/i.test(before) ? before.slice(0, 40) : "";

if (sha && sha !== "0000000000000000000000000000000000000000") {
  const refFile = `${sha}:frontend/package.json`;
  if (existsRefFile(refFile)) {
    const raw = run(`git show ${refFile}`);
    prev = JSON.parse(raw).version as string;
  }
}

setOutput("current", curr);

if (prev) {
  setOutput("should_release", curr === prev ? "false" : "true");
} else {
  setOutput("should_release", missingPrev === "skip" ? "false" : "true");
}

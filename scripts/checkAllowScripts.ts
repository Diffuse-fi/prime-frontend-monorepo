/**
 * This script checks that the lavamoat allow-scripts configuration
 * in package.json is up-to-date with all installed dependencies.
 * It runs `allow-scripts auto` and verifies no changes are needed.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function main() {
  const rootDir = path.resolve(__dirname, "..");
  const packageJsonPath = path.join(rootDir, "package.json");

  // Read the current package.json content
  const originalContent = fs.readFileSync(packageJsonPath, "utf8");

  // Run allow-scripts auto to update configuration if needed
  console.log("Running allow-scripts auto to check configuration...");

  // eslint-disable-next-line sonarjs/os-command
  const result = spawnSync("npx", ["allow-scripts", "auto"], {
    cwd: rootDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    throw new Error(`Failed to run allow-scripts: ${result.error.message}`);
  }

  // Show the output from allow-scripts
  if (result.stdout) {
    console.log(result.stdout);
  }
  if (result.stderr) {
    console.error(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error(`allow-scripts exited with code ${result.status}`);
  }

  // Read the potentially modified package.json
  const updatedContent = fs.readFileSync(packageJsonPath, "utf8");

  // Compare the contents
  if (originalContent !== updatedContent) {
    // Restore the original content
    fs.writeFileSync(packageJsonPath, originalContent, "utf8");

    throw new Error(
      "allow-scripts configuration is outdated!\n" +
        "Run 'npx allow-scripts auto' to update the configuration,\n" +
        "then commit the changes to package.json.\n" +
        "\nOutput from allow-scripts:\n" +
        result.stdout
    );
  }

  console.log("✓ allow-scripts configuration is up-to-date");
}

main();

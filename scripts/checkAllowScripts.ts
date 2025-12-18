/**
 * This script checks that the lavamoat allow-scripts configuration
 * in package.json is up-to-date with all installed dependencies.
 * It runs `allow-scripts auto` and verifies no changes are needed.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function main() {
  const rootDir = path.resolve(__dirname, "..");
  const packageJsonPath = path.join(rootDir, "package.json");

  // Read the current package.json content
  const originalContent = fs.readFileSync(packageJsonPath, "utf8");

  try {
    // Run allow-scripts auto to update configuration if needed
    console.log("Running allow-scripts auto to check configuration...");
    
    // eslint-disable-next-line sonarjs/os-command
    const output = execSync("npx allow-scripts auto", {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    console.log(output);

    // Read the potentially modified package.json
    const updatedContent = fs.readFileSync(packageJsonPath, "utf8");

    // Compare the contents
    if (originalContent !== updatedContent) {
      // Restore the original content
      fs.writeFileSync(packageJsonPath, originalContent, "utf8");

      throw new Error(
        "allow-scripts configuration is outdated!\n" +
          "Run 'npx allow-scripts auto' to update the configuration,\n" +
          "then commit the changes to package.json."
      );
    }

    console.log("✓ allow-scripts configuration is up-to-date");
  } catch (error) {
    // Ensure we restore the original content in case of any error
    fs.writeFileSync(packageJsonPath, originalContent, "utf8");
    throw error;
  }
}

main();

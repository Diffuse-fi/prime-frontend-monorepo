import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDir, "..");
const manifestPath = resolve(frontendRoot, "public", "manifest.json");

nextEnv.loadEnvConfig(frontendRoot, false);

async function generateSafeManifest() {
  const { env } = await import("../src/env");
  const manifest = {
    name: env.NEXT_PUBLIC_APP_NAME,
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    iconPath: "/logo.svg",
  };

  return await writeFile(
    manifestPath,
    JSON.stringify(manifest, null, 2) + "\n", // add newline at end of file
    "utf8"
  );
}

await generateSafeManifest();

console.log("Safe manifest built successfully.");

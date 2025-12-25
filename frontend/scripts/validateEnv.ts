import nextEnv from "@next/env";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDir, "..");

nextEnv.loadEnvConfig(frontendRoot, false);

await import("../src/env");

console.info("Environment variables are valid.");

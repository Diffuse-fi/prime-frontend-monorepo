import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import nextEnv from "@next/env";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDir, "..");

nextEnv.loadEnvConfig(frontendRoot, false);

await import("../src/env");

console.log("Environment variables are valid.");

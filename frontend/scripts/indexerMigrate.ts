import "dotenv/config";
import { runIndexerMigrations } from "@diffuse/indexer";

import { indexerDbConfig } from "@/lib/indexer";
import { isIndexerEnabled } from "@/lib/indexer/isEnabled";

async function main() {
  try {
    const indexerEnabled = isIndexerEnabled();

    if (!indexerEnabled) {
      console.info("Indexer is disabled. Skipping migrations.");
      return;
    }

    if (!shouldRunMigrations()) {
      console.info("Skipping indexer migrations because VERCEL_ENV is not production");
      return;
    }

    const dbConfig = indexerDbConfig;
    await runIndexerMigrations(dbConfig);

    console.info("Indexer migrations completed");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Indexer migration failed: " + error.message);
    }

    throw error;
  }
}

function shouldRunMigrations() {
  const vercelEnv = process.env.VERCEL_ENV;
  if (!vercelEnv) return true;

  return vercelEnv === "production";
}

await main();

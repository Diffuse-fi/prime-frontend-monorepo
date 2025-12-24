import "dotenv/config";
import { runIndexerMigrations } from "@diffuse/indexer";
import { indexerDbConfig } from "@/lib/indexer";
import { isIndexerEnabled } from "@/lib/indexer/isEnabled";

function shouldRunMigrations() {
  const vercelEnv = process.env.VERCEL_ENV;
  if (!vercelEnv) return true;

  return vercelEnv === "production";
}

async function main() {
  const indexerEnabled = isIndexerEnabled();

  if (!indexerEnabled) {
    console.log("Indexer is disabled. Skipping migrations.");
    return;
  }

  if (!shouldRunMigrations()) {
    console.log("Skipping indexer migrations because VERCEL_ENV is not production");
    return;
  }

  const dbConfig = indexerDbConfig;
  await runIndexerMigrations(dbConfig);
  console.log("Indexer migrations completed");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

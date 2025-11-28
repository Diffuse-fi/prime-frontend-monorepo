import "dotenv/config";
import { runIndexerMigrations } from "@diffuse/indexer";
import { indexerDbConfig } from "@/lib/indexer";

function shouldRunMigrations() {
  const vercelEnv = process.env.VERCEL_ENV;
  if (!vercelEnv) return true;

  return vercelEnv === "production";
}

async function main() {
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

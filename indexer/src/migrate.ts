import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb, DbConfig } from "./features/db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getMigrationsFolder(): string {
  return join(__dirname, "../migrations");
}

export async function runIndexerMigrations(config: DbConfig) {
  const { db, pool } = createDb(config);
  const migrationsFolder = getMigrationsFolder();

  try {
    await migrate(db, { migrationsFolder });
  } finally {
    await pool.end();
  }
}

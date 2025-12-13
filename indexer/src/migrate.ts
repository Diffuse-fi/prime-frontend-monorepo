import { migrate } from "drizzle-orm/node-postgres/migrator";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createDb, DbConfig } from "./features/db";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runIndexerMigrations(config: DbConfig) {
  const { db, pool } = createDb(config);
  const migrationsFolder = getMigrationsFolder();

  try {
    await migrate(db, { migrationsFolder });
  } finally {
    await pool.end();
  }
}

function getMigrationsFolder(): string {
  return join(__dirname, "../migrations");
}

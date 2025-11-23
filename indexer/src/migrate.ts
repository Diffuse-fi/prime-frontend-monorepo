import path from "node:path";
import { createDb, DbConfig } from "./features/db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

function getMigrationsFolder(): string {
  return path.join(__dirname, "../migrations");
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

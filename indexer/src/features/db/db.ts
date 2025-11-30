import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { schema } from "./schema";
import { DbConfig, DbConfigSchema } from "./config";

export function createDb(config: DbConfig) {
  const { maxConnections, connectionString } = DbConfigSchema.parse(config);

  const pool = new pg.Pool({
    connectionString,
    max: maxConnections,
  });

  const db = drizzle(pool, { schema });

  return { db, pool };
}

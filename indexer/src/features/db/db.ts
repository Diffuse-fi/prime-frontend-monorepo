import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { DbConfig, DbConfigSchema } from "./config";
import { schema } from "./schema";

export function createDb(config: DbConfig) {
  const { connectionString, maxConnections } = DbConfigSchema.parse(config);

  const pool = new pg.Pool({
    connectionString,
    max: maxConnections,
  });

  const db = drizzle(pool, { schema });

  return { db, pool };
}

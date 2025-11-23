import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { schema } from "./schema";
import { DbConfig, DbConfigSchema } from "./config";
import { buildConnectionString } from "./utils";

export function createDb(config: DbConfig) {
  const { ssl, maxConnections } = DbConfigSchema.parse(config);
  const connectionString = buildConnectionString(config);

  const pool = new pg.Pool({
    connectionString,
    max: maxConnections,
    ssl: ssl ? {} : false,
  });

  const db = drizzle(pool, { schema });

  return { db, pool };
}

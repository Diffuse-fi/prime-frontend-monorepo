import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL_WRITER ?? process.env.DATABASE_URL ?? "";

export const pool = new pg.Pool({ connectionString, max: 5 });
export const db = drizzle(pool);

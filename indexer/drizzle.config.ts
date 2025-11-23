import type { Config } from "drizzle-kit";

export default {
  schema: "./src/features/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
} satisfies Config;

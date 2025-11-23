import { DbConfig, DbConfigSchema } from "./config";

export function buildConnectionString(dbConfig: DbConfig): string {
  DbConfigSchema.parse(dbConfig);

  const user = encodeURIComponent(dbConfig.user);
  const password = encodeURIComponent(dbConfig.password);
  const host = dbConfig.host;
  const port = dbConfig.port;
  const dbName = dbConfig.database;

  return `postgresql://${user}:${password}@${host}:${port}/${dbName}`;
}

import { describe, it, expect } from "vitest";
import { buildConnectionString } from "./utils";
import type { DbConfig } from "./config";

describe("buildConnectionString", () => {
  it("builds a valid connection string from config", () => {
    const config: DbConfig = {
      user: "user",
      password: "pass",
      host: "localhost",
      port: 5432,
      database: "mydb",
    };

    const result = buildConnectionString(config);

    expect(result).toBe("postgresql://user:pass@localhost:5432/mydb");
  });

  it("encodes user and password", () => {
    const config: DbConfig = {
      user: "user name",
      password: "p@ss:word/!?",
      host: "db.example.com",
      port: 5432,
      database: "db-name",
    };

    const result = buildConnectionString(config);

    expect(result).toBe(
      "postgresql://user%20name:p%40ss%3Aword%2F!%3F@db.example.com:5432/db-name"
    );
  });
});

import z from "zod";

export const NamespaceSchema = z.enum([
  "*",
  "rq:*", // reads all react-query logs
  "rq:query",
  "rq:mut",
  "app:*", // reads all app logs, both lend and borrow
  "app:lend",
  "app:borrow",
  "wallet",
  "chain",
  "location",
]);

export const LogLevelSchema = z.enum([
  "error",
  "warn",
  "info",
  "debug",
  "trace",
]);

export const NamespacesCsvSchema = z
  .string()
  .trim()
  .superRefine((val, ctx) => {
    if (!val) return;

    const tokens = val
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const isValidToken = (t: string) => {
      if (t === "*") return true;

      const neg = t.startsWith("!") || t.startsWith("-");
      const core = neg ? t.slice(1) : t;

      return NamespaceSchema.safeParse(core).success;
    };

    for (const t of tokens) {
      if (!isValidToken(t)) {
        ctx.addIssue({
          code: "custom",
          message: `Invalid namespace token: "${t}"`,
        });
      }
    }
  });

export type Namespace = z.infer<typeof NamespaceSchema>;
export type LogLevel = z.infer<typeof LogLevelSchema>;

import z from "zod";

export const DbConfigSchema = z.object({
  maxConnections: z.number().optional(),
  connectionString: z
    .string()
    .min(1)
    .refine(url => url.startsWith("postgres://") || url.startsWith("postgresql://"), {
      message:
        "Must be a valid PostgreSQL connection string (postgres:// or postgresql://)",
    }),
});

export type DbConfig = z.infer<typeof DbConfigSchema>;

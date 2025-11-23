import z from "zod";

export const DbConfigSchema = z.object({
  maxConnections: z.number().optional(),
  user: z.string().min(1),
  password: z.string().min(1),
  host: z.string().min(1),
  port: z.number().int(),
  database: z.string().min(1),
  ssl: z.boolean().optional(),
});

export type DbConfig = z.infer<typeof DbConfigSchema>;

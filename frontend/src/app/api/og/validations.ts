import { z } from "zod";

export const QuerySchema = z.object({
  title: z.string().trim().default("").optional(),
  description: z.string().trim().default("").optional(),
  version: z
    .string()
    .trim()
    .regex(/^\d+$/, "version must be a positive integer")
    .default("1")
    .optional()
    .transform(v => (typeof v === "string" ? v : "1")),
  path: z.string().trim().optional(),
});

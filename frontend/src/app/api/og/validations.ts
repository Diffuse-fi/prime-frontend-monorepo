import { z } from "zod";

export const QuerySchema = z.object({
  description: z.string().trim().default("").optional(),
  path: z.string().trim().optional(),
  title: z.string().trim().default("").optional(),
  version: z
    .string()
    .trim()
    .regex(/^\d+$/, "version must be a positive integer")
    .default("1")
    .optional()
    .transform(v => (typeof v === "string" ? v : "1")),
});

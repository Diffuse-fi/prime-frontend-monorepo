import { z } from "zod";

export const QuerySchema = z.object({
  title: z.string().trim().max(100, "title must be ≤ 100 characters").optional(),
  description: z
    .string()
    .trim()
    .max(200, "description must be ≤ 200 characters")
    .default("")
    .optional(),
  version: z
    .string()
    .trim()
    .regex(/^\d+$/, "version must be a positive integer")
    .default("1")
    .optional()
    .transform(v => (typeof v === "string" ? v : "1")),
  path: z.string().trim().optional(),
});

import { z } from "zod";

export const QuerySchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, "title must be ≤ 100 characters")
    .optional()
    .transform(v => (typeof v === "string" ? v.slice(0, 100) : v)),
  description: z
    .string()
    .trim()
    .max(200, "description must be ≤ 200 characters")
    .default("")
    .optional()
    .transform(v => (typeof v === "string" ? v.slice(0, 200) : v)),
});

export const OgSizeSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const CacheLifetimeSchema = z
  .number()
  .int()
  .positive()
  .max(60 * 60 * 24 * 30, "cacheLifeTime cannot exceed 30 days");

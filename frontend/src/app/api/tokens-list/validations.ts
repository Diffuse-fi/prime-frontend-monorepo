import { z } from "zod";

export const QuerySchema = z.object({
  chains: z
    .string()
    .optional()
    .transform(v =>
      v
        ? [
            ...new Set(
              v
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
            ),
          ]
            .map(n => Number(n))
            .filter(n => Number.isInteger(n) && n >= 0)
        : undefined
    ),
});

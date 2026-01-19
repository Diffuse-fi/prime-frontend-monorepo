import { z } from "zod";

export const RpcOverrideModeSchema = z.enum(["off", "prepend", "only"]);
export const RpcOverridesSchema = z
  .string()
  .transform(v => JSON.parse(v))
  .pipe(
    z.record(
      z.union([
        z.string().min(1),
        z.array(z.string().min(1)).min(1),
      ])
    )
  )
  .transform(rec => {
    const out: Record<string, string[]> = {};

    for (const [k, v] of Object.entries(rec)) {
      const urls = (Array.isArray(v) ? v : [v]).map(x => x.trim()).filter(Boolean);
      if (urls.length > 0) out[k] = urls;
    }

    return out;
  });

import { z } from "zod";

import { AddressSchema } from "./validations";

const Json = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(v => {
    if (typeof v !== "string") return v;
    const s = v.trim();
    if (s === "") return;
    try {
      return JSON.parse(s);
    } catch {
      return;
    }
  }, schema);

export const AddressesOverridesSchema = Json(
  z.record(
    z.string().refine(s => z.number().int().safeParse(Number(s)).success, {
      message: "Invalid chain ID",
    }),
    z.record(z.string().min(1), z.object({ current: AddressSchema }))
  )
);

export type AddressesOverrides = z.infer<typeof AddressesOverridesSchema>;

import { z } from "zod";

import { envJsonSchemaWithError } from "../misc/env";
import { AddressSchema } from "./validations";

export const AddressesOverridesSchema = envJsonSchemaWithError(
  z.record(
    z.string().refine(s => z.number().int().safeParse(Number(s)).success, {
      message: "Invalid chain ID",
    }),
    z.record(z.string().min(1), z.object({ current: AddressSchema }))
  )
);

export type AddressesOverrides = z.infer<typeof AddressesOverridesSchema>;

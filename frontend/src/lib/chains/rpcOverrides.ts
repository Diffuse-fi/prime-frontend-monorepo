import { z } from "zod";

import { envJsonSchemaWithError } from "../misc/env";

export const RpcOverrideModeSchema = z.enum(["off", "prepend", "only"]);

export const RpcOverridesSchema = envJsonSchemaWithError(
  z.record(z.string().min(1), z.array(z.string().min(1)).min(1))
);

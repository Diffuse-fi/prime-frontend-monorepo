import { z } from "zod";
import { AddressSchema } from "../wagmi/validations";

export const AssetInfoSchema = z.object({
  chainId: z.number().int().nonnegative(),
  address: AddressSchema,
  name: z.string().min(1),
  symbol: z.string().min(1),
  decimals: z.number().int().min(0).max(255),
  logoURI: z.url().optional(),
  extensions: z.record(z.string(), z.any()).optional(),
  legacyAllowance: z.boolean().optional(),
});

export type AssetInfo = z.infer<typeof AssetInfoSchema>;

export const AssetInfoArraySchema = z.array(AssetInfoSchema).min(1);

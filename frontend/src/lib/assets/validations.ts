import { z } from "zod";
import { isAddress } from "viem";

export const AssetInfoSchema = z.object({
  chainId: z.number().int().nonnegative(),
  address: z.string().refine(s => isAddress(s), {
    message: "Invalid EVM address",
  }),
  name: z.string().min(1),
  symbol: z.string().min(1),
  decimals: z.number().int().min(0).max(255),
  logoURI: z.string().url().optional(),
  extensions: z.record(z.any()).optional(),
  legacyAllowance: z.boolean().optional(),
});

export type AssetInfo = z.infer<typeof AssetInfoSchema>;

export const AssetInfoArraySchema = z.array(AssetInfoSchema).min(1);

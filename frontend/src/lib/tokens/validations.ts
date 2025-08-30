import { z } from "zod";
import { isAddress } from "viem";

export const TokenInfoSchema = z.object({
  chainId: z.number().int().nonnegative(),
  address: z.string().refine(s => isAddress(s), {
    message: "Invalid EVM address",
  }),
  name: z.string().min(1),
  symbol: z.string().min(1),
  decimals: z.number().int().min(0).max(255).optional(),
  logoURI: z.string().url().optional(),
  extensions: z.record(z.any()).optional(),
});

export type TokenInfo = z.infer<typeof TokenInfoSchema>;

export const TokenInfoArraySchema = z.array(TokenInfoSchema).min(1);

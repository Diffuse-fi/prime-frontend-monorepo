import { z } from "zod";
import { isAddress } from "viem";

export const AllowedTokenSchema = z.object({
  chainId: z.number().int().nonnegative(),
  address: z.string(),
  symbol: z.string(),
});

export const AllowedTokensSchema = z.array(AllowedTokenSchema);
export type AllowedTokenList = z.infer<typeof AllowedTokensSchema>;

const VersionSchema = z.object({
  major: z.number().int().nonnegative(),
  minor: z.number().int().nonnegative(),
  patch: z.number().int().nonnegative(),
});

const TagSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

const TagsSchema = z.record(TagSchema).optional();

const TokenInfoSchema = z.object({
  chainId: z.number().int().nonnegative(),
  address: z.string().refine(s => isAddress(s), {
    message: "Invalid EVM address",
  }),
  name: z.string().min(1),
  symbol: z.string().min(1),
  decimals: z.number().int().min(0).max(255),
  logoURI: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  extensions: z.record(z.any()).optional(),
});

export const TokenInfoArraySchema = z.array(TokenInfoSchema).min(1);

export const TokenListResponseSchema = z.object({
  name: z.string().min(1),
  timestamp: z.string().datetime({ offset: true }),
  version: VersionSchema,
  tokens: TokenInfoArraySchema,
  keywords: z.array(z.string()).optional(),
  logoURI: z.string().url().optional(),
  tags: TagsSchema,
});

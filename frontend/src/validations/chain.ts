import { z } from "zod";

export const ChainSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number().int(),
  }),
  rpcUrls: z.object({
    default: z.object({ http: z.array(z.string().url()) }),
    public: z.object({ http: z.array(z.string().url()) }).optional(),
  }),
  blockExplorers: z
    .object({
      default: z.object({ name: z.string(), url: z.string().url() }),
    })
    .passthrough(),
});

export type RuntimeChain = z.infer<typeof ChainSchema>;

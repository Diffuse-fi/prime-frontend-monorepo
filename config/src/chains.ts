import { Chain, mainnet } from "viem/chains";
import z from "zod";

import { ChainIdSchema } from "./common";

function extendChain<T extends Record<string, unknown>>(
  chain: Chain,
  overrides: T
): Chain & T {
  return {
    ...chain,
    ...overrides,
  };
}

export const CHAINS = [
  extendChain(mainnet, {
    iconBackground: "transparent",
    iconUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/ethereum/info/logo.png",
  }),
] as const;

const ChainContractSchema = z.object({
  address: z.string(),
  blockCreated: z.number().int().optional(),
});

const ChainNativeCurrencySchema = z.object({
  decimals: z.number().int(),
  name: z.string(),
  symbol: z.string(),
});

const ChainRpcUrlEntrySchema = z.object({
  http: z.array(z.string()),
  webSocket: z.array(z.string()).optional(),
});

const ChainBlockExplorerSchema = z.object({
  apiUrl: z.string().optional(),
  name: z.string(),
  url: z.string(),
});

const ChainConfigSchema = z.object({
  blockExplorers: z
    .object({
      default: ChainBlockExplorerSchema,
    })
    .catchall(ChainBlockExplorerSchema)
    .optional(),
  blockTime: z.number().int().optional(),
  contracts: z.record(ChainContractSchema).optional(),
  iconBackground: z.string().optional(),
  iconUrl: z.string().url().optional(),
  id: ChainIdSchema,
  name: z.string(),
  nativeCurrency: ChainNativeCurrencySchema,
  rpcUrls: z
    .object({
      default: ChainRpcUrlEntrySchema,
    })
    .catchall(ChainRpcUrlEntrySchema),
  sourceId: z.number().int().optional(),
  testnet: z.boolean().optional(),
});

export const ChainsSchema = z.array(ChainConfigSchema);

export function getChainsDefaultRpcUrls(): string[] {
  const urls: string[] = [];

  for (const chain of CHAINS) {
    const defaultRpc = chain.rpcUrls.default;
    if (defaultRpc && defaultRpc.http.length > 0) {
      urls.push(...defaultRpc.http);
    }
  }

  return urls;
}

export function getChainsResourcesUrls(): string[] {
  const urls: string[] = [];

  for (const chain of CHAINS) {
    if (chain.iconUrl) {
      urls.push(chain.iconUrl);
    }
  }

  return urls;
}

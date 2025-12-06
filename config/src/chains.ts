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
    iconUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/ethereum/info/logo.png",
    iconBackground: "transparent",
  }),
] as const;

const ChainContractSchema = z.object({
  address: z.string(),
  blockCreated: z.number().int().optional(),
});

const ChainNativeCurrencySchema = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
});

const ChainRpcUrlEntrySchema = z.object({
  http: z.array(z.string()),
  webSocket: z.array(z.string()).optional(),
});

const ChainBlockExplorerSchema = z.object({
  name: z.string(),
  url: z.string(),
  apiUrl: z.string().optional(),
});

const ChainConfigSchema = z.object({
  id: ChainIdSchema,
  name: z.string(),
  nativeCurrency: ChainNativeCurrencySchema,
  blockTime: z.number().int().optional(),
  rpcUrls: z
    .object({
      default: ChainRpcUrlEntrySchema,
    })
    .catchall(ChainRpcUrlEntrySchema),
  blockExplorers: z
    .object({
      default: ChainBlockExplorerSchema,
    })
    .catchall(ChainBlockExplorerSchema)
    .optional(),
  iconUrl: z.string().url().optional(),
  iconBackground: z.string().optional(),
  contracts: z.record(ChainContractSchema).optional(),
  testnet: z.boolean().optional(),
  sourceId: z.number().int().optional(),
});

export const ChainsSchema = z.array(ChainConfigSchema);

export function getChainsResourcesUrls(): string[] {
  const urls: string[] = [];

  for (const chain of CHAINS) {
    if (chain.iconUrl) {
      urls.push(chain.iconUrl);
    }
  }

  return urls;
}

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

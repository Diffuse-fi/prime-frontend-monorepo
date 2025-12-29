import { zeroAddress } from "viem";
import z from "zod";

import { AddressSchema, ChainIdSchema } from "./common";

export const ASSETS: Assets = {
  chains: [
    {
      assets: [
        {
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          chainId: 1,
          decimals: 6,
          legacyAllowance: false,
          logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
          name: "USD Coin",
          symbol: "USDC",
        },
        {
          address: zeroAddress,
          chainId: 1,
          decimals: 18,
          legacyAllowance: false,
          logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
          name: "Ether",
          symbol: "ETH",
        },
        {
          address: "0x545A490f9ab534AdF409A2E682bc4098f49952e3",
          chainId: 1,
          decimals: 18,
          legacyAllowance: false,
          logoURI:
            "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/e8e8523f-cce9-4933-b286-66aaec6ab805.svg",
          name: "PT-cUSD-29JAN2026",
          symbol: "PT-cUSD-29JAN2026",
        },
        {
          address: "0xC3c7E5E277d31CD24a3Ac4cC9af3B6770F30eA33",
          chainId: 1,
          decimals: 18,
          legacyAllowance: false,
          logoURI:
            "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/0b894259-7c84-4ec3-9090-92615fb276b6.svg",
          name: "PT-stcUSD-29JAN2026",
          symbol: "PT-stcUSD-29JAN2026",
        },
      ],
      chainId: 1,
      name: "Ethereum Mainnet",
    },
  ],
};

export const AssetInfoSchema = z.object({
  address: AddressSchema,
  chainId: ChainIdSchema,
  decimals: z.number().int().min(0).max(255),
  extensions: z.record(z.string(), z.any()).optional(),
  legacyAllowance: z.boolean().optional(),
  logoURI: z.string().url().optional(),
  name: z.string().min(1),
  symbol: z.string().min(1),
});

export type AssetInfo = z.infer<typeof AssetInfoSchema>;

export const AssetsSchema = z.object({
  chains: z.array(
    z.object({
      assets: z.array(AssetInfoSchema),
      chainId: ChainIdSchema,
      name: z.string().min(1),
    })
  ),
});

export type Assets = z.infer<typeof AssetsSchema>;

export function getAssetsResourcesUrls(): string[] {
  const urls: string[] = [];

  for (const chain of ASSETS.chains) {
    for (const asset of chain.assets) {
      if (asset.logoURI) {
        urls.push(asset.logoURI);
      }
    }
  }

  return urls;
}

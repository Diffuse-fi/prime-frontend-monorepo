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
          symbol: "ETH",
          name: "Ether",
          address: zeroAddress,
          chainId: 1,
          decimals: 18,
          legacyAllowance: false,
          logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
        },
        {
          address: "0x01d6dafa8B3bD04bDf7bA6Ff76104d15E2B7485c",
          chainId: 1,
          decimals: 18,
          legacyAllowance: false,
          logoURI:
            "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/57a4f9fc-a935-433b-8648-daa034e65bfe.svg",
          name: "PT-ghUSDC-18DEC2025",
          symbol: "PT-ghUSDC-18DEC2025",
        },
      ],
      chainId: 1,
      name: "Ethereum Mainnet",
    },
  ],
};

export const AssetInfoSchema = z.object({
  chainId: ChainIdSchema,
  address: AddressSchema,
  name: z.string().min(1),
  symbol: z.string().min(1),
  decimals: z.number().int().min(0).max(255),
  logoURI: z.string().url().optional(),
  extensions: z.record(z.string(), z.any()).optional(),
  legacyAllowance: z.boolean().optional(),
});

export type AssetInfo = z.infer<typeof AssetInfoSchema>;

export const AssetsSchema = z.object({
  chains: z.array(
    z.object({
      chainId: ChainIdSchema,
      name: z.string().min(1),
      assets: z.array(AssetInfoSchema),
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

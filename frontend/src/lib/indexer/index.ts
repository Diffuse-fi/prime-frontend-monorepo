import { mainnet } from "viem/chains";
import { createIndexer } from "@diffuse/indexer";
import { env } from "@/env";
import { getAvailableChains } from "../chains";
import { Chain } from "@rainbow-me/rainbowkit";

export const indexerDbConfig = {
  connectionString: env.INDEXER_DATABASE_URL,
  maxConnections: env.INDEXER_DATABASE_MAX_CONNECTIONS,
};

export const indexer = createIndexer({
  chains: getAvailableChains() as unknown as [Chain, ...Chain[]],
  rpcUrls: getAvailableChains().reduce(
    (acc, chain) => {
      acc[chain.id] = chain.rpcUrls.default.http[0];
      return acc;
    },
    {} as Record<number, string>
  ),
  db: indexerDbConfig,
  // Will be used on the first run when there is no checkpoint in the database
  startBlocks: {
    [mainnet.id]: 23_861_823,
  },
});

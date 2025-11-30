import { mainnet, sonic } from "viem/chains";
import { createIndexer } from "@diffuse/indexer";
import { env } from "@/env";
import { RPCs } from "../chains/rpc";

export const indexerDbConfig = {
  connectionString: env.INDEXER_DATABASE_URL,
  maxConnections: env.INDEXER_DATABASE_MAX_CONNECTIONS,
};

export const indexer = createIndexer({
  chains: [mainnet, sonic],
  rpcUrls: Object.fromEntries(
    [mainnet, sonic].map(chain => [chain.id, RPCs[chain.id][0]!])
  ),
  db: indexerDbConfig,
  // Will be used on the first run when there is no checkpoint in the database
  startBlocks: {
    [mainnet.id]: 23_861_823,
    [sonic.id]: 56_206_505,
  },
});

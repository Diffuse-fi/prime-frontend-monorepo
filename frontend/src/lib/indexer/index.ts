import "server-only";
import { mainnet, sonic } from "viem/chains";
import { createIndexer } from "@diffuse/indexer";
import { env } from "@/env";
import { RPCs } from "../chains/rpc";

export const indexerDbConfig = {
  user: env.INDEXER_DATABASE_USER,
  password: env.INDEXER_DATABASE_PASSWORD,
  host: env.INDEXER_DATABASE_HOST,
  port: env.INDEXER_DATABASE_PORT,
  database: env.INDEXER_DATABASE_NAME,
  ssl: env.INDEXER_DATABASE_SSL,
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

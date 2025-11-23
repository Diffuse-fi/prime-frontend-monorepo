import { createDb, DbConfig, DbConfigSchema, IndexerStorage } from "@/features/db";
import { Indexer } from "@/lib/Indexer";
import { Chain } from "viem";
import z from "zod";
import { ChainRuntime } from "@/features/runtime";
import { getStartBlockForChainId } from "./utils";

export type IndexerConfig = {
  chains: [Chain, ...Chain[]];
  rpcUrls: Record<number, string>;
  startBlocks?: Record<number, bigint | number>;
  db: DbConfig;
};

const IndexerConfigSchema = z.object({
  chains: z
    .array(
      z
        .object({
          id: z.number(),
          name: z.string(),
        })
        .loose()
    )
    .nonempty(),
  rpcUrls: z.record(z.number(), z.string()),
  startBlocks: z.record(z.number(), z.union([z.bigint(), z.number()])).optional(),
  db: DbConfigSchema,
});

export function createIndexer(config: IndexerConfig): Indexer {
  IndexerConfigSchema.parse(config);

  const { db: dbConfig, chains, rpcUrls, startBlocks } = config;
  const { db } = createDb(dbConfig);
  const storage = new IndexerStorage(db);

  const runtimes = new Map<number, ChainRuntime>();

  for (const chain of chains) {
    const rpcUrl = rpcUrls[chain.id];

    if (!rpcUrl) {
      throw new Error(`Missing RPC URL for chain ${chain.id}`);
    }

    const startBlock = getStartBlockForChainId(chain.id, startBlocks);
    const runtime = new ChainRuntime(chain, rpcUrl, startBlock);
    runtimes.set(chain.id, runtime);
  }

  return new Indexer({
    db,
    storage,
    runtimes,
  });
}

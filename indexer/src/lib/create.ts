import { CHAINS } from "@diffuse/config";
import z from "zod";

import { createDb, DbConfig, DbConfigSchema, IndexerStorage } from "@/features/db";
import { ChainRuntime } from "@/features/runtime";
import { Indexer } from "@/lib/Indexer";

import { getStartBlockForChainId } from "./utils";

export type IndexerConfig = {
  chainIdsToIgnore?: number[];
  db: DbConfig;
  rpcUrls?: Record<number, string[]>;
  startBlocks?: Record<number, bigint | number>;
};

const IndexerConfigSchema = z.object({
  chainIdsToIgnore: z.array(z.number()).optional(),
  db: DbConfigSchema,
  rpcUrls: z.record(z.coerce.number(), z.array(z.string())).optional(),
  startBlocks: z.record(z.coerce.number(), z.union([z.bigint(), z.number()])).optional(),
});

export function createIndexer(config: IndexerConfig): Indexer {
  const {
    chainIdsToIgnore = [],
    db: dbConfig,
    rpcUrls,
    startBlocks,
  } = IndexerConfigSchema.parse(config);
  const { db, pool } = createDb(dbConfig);
  const storage = new IndexerStorage(db);

  const runtimes = new Map<number, ChainRuntime>();
  const idsToIgnore = new Set(chainIdsToIgnore);

  for (const chain of CHAINS) {
    if (idsToIgnore.has(chain.id)) {
      continue;
    }

    const overrides = rpcUrls ? rpcUrls[chain.id] : [];

    const rpcUrlsWithOverrides = [
      ...(chain.rpcUrls?.default?.http ?? []),
      ...overrides,
    ];

    if (rpcUrlsWithOverrides.length === 0) {
      throw new Error(`Missing RPC URL for chain ${chain.id}`);
    }

    const startBlock = getStartBlockForChainId(chain.id, startBlocks);
    const runtime = new ChainRuntime(chain, rpcUrlsWithOverrides, startBlock);
    runtimes.set(chain.id, runtime);
  }

  return new Indexer({
    db,
    pool,
    runtimes,
    storage,
  });
}

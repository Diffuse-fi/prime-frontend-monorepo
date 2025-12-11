import { createDb, DbConfig, DbConfigSchema, IndexerStorage } from "@/features/db";
import { Indexer } from "@/lib/Indexer";
import z from "zod";
import { ChainRuntime } from "@/features/runtime";
import { getStartBlockForChainId } from "./utils";
import { CHAINS } from "@diffuse/config";

export type IndexerConfig = {
  rpcUrls?: Record<number, string[]>;
  startBlocks?: Record<number, bigint | number>;
  chainIdsToIgnore?: number[];
  db: DbConfig;
};

const IndexerConfigSchema = z.object({
  rpcUrls: z.record(z.coerce.number(), z.array(z.string())).optional(),
  startBlocks: z.record(z.coerce.number(), z.union([z.bigint(), z.number()])).optional(),
  chainIdsToIgnore: z.array(z.number()).optional(),
  db: DbConfigSchema,
});

export function createIndexer(config: IndexerConfig): Indexer {
  const {
    db: dbConfig,
    rpcUrls,
    startBlocks,
    chainIdsToIgnore = [],
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

    if (!rpcUrlsWithOverrides.length) {
      throw new Error(`Missing RPC URL for chain ${chain.id}`);
    }

    const startBlock = getStartBlockForChainId(chain.id, startBlocks);
    const runtime = new ChainRuntime(chain, rpcUrlsWithOverrides, startBlock);
    runtimes.set(chain.id, runtime);
  }

  return new Indexer({
    db,
    storage,
    runtimes,
    pool,
  });
}

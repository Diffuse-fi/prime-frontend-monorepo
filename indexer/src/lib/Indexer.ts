import type { IndexerDb, IndexerStorage } from "@/features/db";
import type { ChainRuntime } from "@/features/runtime";
import { Pool } from "pg";

export type IndexerInit = {
  db: IndexerDb;
  storage: IndexerStorage;
  runtimes: Map<number, ChainRuntime>;
  pool?: Pool;
};

export class Indexer {
  readonly db: IndexerDb;
  readonly storage: IndexerStorage;
  readonly runtimes: Map<number, ChainRuntime>;
  private readonly pool?: Pool;

  constructor(init: IndexerInit) {
    this.db = init.db;
    this.storage = init.storage;
    this.runtimes = init.runtimes;
    this.pool = init.pool;
  }

  async syncAll() {
    const runtimes = Array.from(this.runtimes.values());

    const results = await Promise.allSettled(
      runtimes.map(runtime => this.syncChain(runtime))
    );

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const runtime = runtimes[i];

      if (result.status === "rejected") {
        console.error(
          `[Indexer] Failed to sync chain ${runtime.chain.id}`,
          result.reason
        );
      }
    }
  }

  private async syncChain(runtime: ChainRuntime) {
    const checkpointAddress = "indexer-global";
    const checkpoint = await this.storage.getCheckpoint(
      runtime.chain.id,
      checkpointAddress
    );

    const latestBlock = await runtime.publicClient.getBlockNumber();

    const fromBlock =
      checkpoint && typeof checkpoint.lastProcessedBlock === "number"
        ? BigInt(checkpoint.lastProcessedBlock) + 1n
        : runtime.startBlock;

    const toBlock = latestBlock;

    if (fromBlock > toBlock) {
      return;
    }

    const vaultInfos = await runtime.viewer.getVaults();
    const now = new Date();

    await this.storage.upsertVaults(
      vaultInfos.map(v => ({
        id: `${runtime.chain.id}:${v.vault}`,
        chainId: runtime.chain.id,
        vault: v.vault,
        discoveredAt: now,
        updatedAt: now,
      }))
    );

    await this.storage.setCheckpoint(
      runtime.chain.id,
      checkpointAddress,
      Number(toBlock)
    );
  }

  async shutdown() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

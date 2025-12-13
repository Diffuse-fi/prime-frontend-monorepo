import type { IndexerDb, IndexerStorage } from "@/features/db";
import type { ChainRuntime } from "@/features/runtime";

import { Pool } from "pg";

export type IndexerInit = {
  db: IndexerDb;
  pool?: Pool;
  runtimes: Map<number, ChainRuntime>;
  storage: IndexerStorage;
};

export class Indexer {
  readonly db: IndexerDb;
  readonly runtimes: Map<number, ChainRuntime>;
  readonly storage: IndexerStorage;
  private readonly pool?: Pool;

  constructor(init: IndexerInit) {
    this.db = init.db;
    this.storage = init.storage;
    this.runtimes = init.runtimes;
    this.pool = init.pool;
  }

  async shutdown() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async syncAll() {
    const runtimes = [...this.runtimes.values()];

    const results = await Promise.allSettled(
      runtimes.map(runtime => this.syncChain(runtime))
    );

    for (const [i, result] of results.entries()) {
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
        chainId: runtime.chain.id,
        discoveredAt: now,
        id: `${runtime.chain.id}:${v.vault}`,
        updatedAt: now,
        vault: v.vault,
      }))
    );

    await this.storage.setCheckpoint(
      runtime.chain.id,
      checkpointAddress,
      Number(toBlock)
    );
  }
}

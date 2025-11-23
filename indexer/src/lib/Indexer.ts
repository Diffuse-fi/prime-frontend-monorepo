import type { IndexerDb, IndexerStorage } from "@/features/db";
import type { ChainRuntime } from "@/features/runtime";

export type IndexerInit = {
  db: IndexerDb;
  storage: IndexerStorage;
  runtimes: Map<number, ChainRuntime>;
};

export class Indexer {
  readonly db: IndexerDb;
  readonly storage: IndexerStorage;
  readonly runtimes: Map<number, ChainRuntime>;

  constructor(init: IndexerInit) {
    this.db = init.db;
    this.storage = init.storage;
    this.runtimes = init.runtimes;
  }

  async syncAll() {
    for (const runtime of this.runtimes.values()) {
      await this.syncChain(runtime);
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
        ? BigInt(checkpoint.lastProcessedBlock + 1)
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
}

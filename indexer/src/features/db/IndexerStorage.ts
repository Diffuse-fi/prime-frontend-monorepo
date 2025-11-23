import { and, desc, eq, inArray } from "drizzle-orm";
import { IndexerDb, checkpoints, events, vaults, positions, prices } from "./schema";

export class IndexerStorage {
  readonly db: IndexerDb;

  constructor(db: IndexerDb) {
    this.db = db;
  }

  async getCheckpoint(chainId: number, address: string) {
    const rows = await this.db
      .select()
      .from(checkpoints)
      .where(
        and(
          eq(checkpoints.chainId, chainId),
          eq(checkpoints.address, address.toLowerCase())
        )
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async setCheckpoint(chainId: number, address: string, lastProcessedBlock: number) {
    await this.db
      .insert(checkpoints)
      .values({
        chainId,
        address: address.toLowerCase(),
        lastProcessedBlock,
      })
      .onConflictDoUpdate({
        target: [checkpoints.chainId, checkpoints.address],
        set: { lastProcessedBlock },
      });
  }

  async insertEvents(rows: Array<typeof events.$inferInsert>) {
    if (!rows.length) return;
    await this.db.insert(events).values(rows).onConflictDoNothing();
  }

  async upsertVaults(rows: Array<typeof vaults.$inferInsert>) {
    if (!rows.length) return;
    await this.db
      .insert(vaults)
      .values(rows)
      .onConflictDoUpdate({
        target: vaults.id,
        set: {
          chainId: vaults.chainId,
          vault: vaults.vault,
          asset: vaults.asset,
          symbol: vaults.symbol,
          decimals: vaults.decimals,
          updatedAt: vaults.updatedAt,
        },
      });
  }

  async upsertPositions(rows: Array<typeof positions.$inferInsert>) {
    if (!rows.length) return;
    await this.db
      .insert(positions)
      .values(rows)
      .onConflictDoUpdate({
        target: positions.id,
        set: {
          status: positions.status,
          closedAt: positions.closedAt,
          amountInRaw: positions.amountInRaw,
          amountOutRaw: positions.amountOutRaw,
          closeTx: positions.closeTx,
          closePriceUsd: positions.closePriceUsd,
          pnlUsd: positions.pnlUsd,
        },
      });
  }

  async getUserPositions(params: { chainId: number; user: string; limit?: number }) {
    const limit = params.limit ?? 50;
    return this.db
      .select()
      .from(positions)
      .where(
        and(
          eq(positions.chainId, params.chainId),
          eq(positions.user, params.user.toLowerCase())
        )
      )
      .orderBy(desc(positions.openedAt))
      .limit(limit);
  }

  async getVaultUserPositions(params: {
    chainId: number;
    vault: string;
    user: string;
    limit?: number;
  }) {
    const limit = params.limit ?? 50;
    return this.db
      .select()
      .from(positions)
      .where(
        and(
          eq(positions.chainId, params.chainId),
          eq(positions.vault, params.vault.toLowerCase()),
          eq(positions.user, params.user.toLowerCase())
        )
      )
      .orderBy(desc(positions.openedAt))
      .limit(limit);
  }

  async upsertPrices(rows: Array<typeof prices.$inferInsert>) {
    if (!rows.length) return;
    await this.db
      .insert(prices)
      .values(rows)
      .onConflictDoUpdate({
        target: [prices.asset, prices.source, prices.tsMinute],
        set: { priceUsd: prices.priceUsd },
      });
  }

  async getLatestPrices(params: { assets: string[]; source: string }) {
    if (!params.assets.length) return [];
    const rows = await this.db
      .select()
      .from(prices)
      .where(
        and(
          inArray(
            prices.asset,
            params.assets.map(a => a.toLowerCase())
          ),
          eq(prices.source, params.source)
        )
      )
      .orderBy(desc(prices.tsMinute));
    return rows;
  }
}

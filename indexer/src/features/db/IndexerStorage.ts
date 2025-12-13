import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { checkpoints, events, IndexerDb, positions, prices, vaults } from "./schema";

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

  async getLatestPrices(params: { assets: string[]; source: string }) {
    if (params.assets.length === 0) return [];
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

  async getUserPositions(params: { chainId: number; limit?: number; user: string }) {
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
    limit?: number;
    user: string;
    vault: string;
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

  async insertEvents(rows: Array<typeof events.$inferInsert>) {
    if (rows.length === 0) return;
    await this.db.insert(events).values(rows).onConflictDoNothing();
  }

  async setCheckpoint(chainId: number, address: string, lastProcessedBlock: number) {
    await this.db
      .insert(checkpoints)
      .values({
        address: address.toLowerCase(),
        chainId,
        lastProcessedBlock,
      })
      .onConflictDoUpdate({
        set: { lastProcessedBlock },
        target: [checkpoints.chainId, checkpoints.address],
      });
  }

  async upsertPositions(rows: Array<typeof positions.$inferInsert>) {
    if (rows.length === 0) return;
    await this.db
      .insert(positions)
      .values(rows)
      .onConflictDoUpdate({
        set: {
          amountInRaw: sql`EXCLUDED.amount_in_raw`,
          amountOutRaw: sql`EXCLUDED.amount_out_raw`,
          closedAt: sql`EXCLUDED.closed_at`,
          closePriceUsd: sql`EXCLUDED.close_price_usd`,
          closeTx: sql`EXCLUDED.close_tx`,
          pnlUsd: sql`EXCLUDED.pnl_usd`,
          status: sql`EXCLUDED.status`,
        },
        target: positions.id,
      });
  }

  async upsertPrices(rows: Array<typeof prices.$inferInsert>) {
    if (rows.length === 0) return;
    await this.db
      .insert(prices)
      .values(rows)
      .onConflictDoUpdate({
        set: { priceUsd: sql`EXCLUDED.price_usd` },
        target: [prices.asset, prices.source, prices.tsMinute],
      });
  }

  async upsertVaults(rows: Array<typeof vaults.$inferInsert>) {
    if (rows.length === 0) return;
    await this.db
      .insert(vaults)
      .values(rows)
      .onConflictDoUpdate({
        set: {
          asset: sql`EXCLUDED.asset`,
          chainId: sql`EXCLUDED.chain_id`,
          decimals: sql`EXCLUDED.decimals`,
          symbol: sql`EXCLUDED.symbol`,
          updatedAt: sql`EXCLUDED.updated_at`,
          vault: sql`EXCLUDED.vault`,
        },
        target: vaults.id,
      });
  }
}

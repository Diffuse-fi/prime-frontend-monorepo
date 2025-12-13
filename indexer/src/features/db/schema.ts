import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import {
  bigint,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const positionStatus = pgEnum("position_status", ["open", "closed"]);

export const vaults = pgTable(
  "vaults",
  {
    asset: varchar("asset", { length: 42 }),
    chainId: integer("chain_id").notNull(),
    decimals: integer("decimals"),
    discoveredAt: timestamp("discovered_at", { withTimezone: false }).notNull(),
    id: varchar("id", { length: 66 }).primaryKey(),
    symbol: varchar("symbol", { length: 16 }),
    updatedAt: timestamp("updated_at", { withTimezone: false }).notNull(),
    vault: varchar("vault", { length: 42 }),
  },
  t => [
    index("vaults_chain_idx").on(t.chainId),
  ]
);

export const events = pgTable(
  "events",
  {
    args: jsonb("args").notNull(),
    blockHash: varchar("block_hash", { length: 66 }).notNull(),
    blockNumber: bigint("block_number", { mode: "number" }).notNull(),
    chainId: integer("chain_id").notNull(),
    contract: varchar("contract", { length: 42 }).notNull(),
    id: varchar("id", { length: 128 }).primaryKey(),
    logIndex: integer("log_index").notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    ts: timestamp("ts", { withTimezone: false }).notNull(),
    txHash: varchar("tx_hash", { length: 66 }).notNull(),
  },
  t => [
    index("events_contract_block_idx").on(t.contract, t.blockNumber),
    index("events_name_ts_idx").on(t.name, t.ts),
  ]
);

export const checkpoints = pgTable(
  "checkpoints",
  {
    address: varchar("address", { length: 42 }).notNull(),
    chainId: integer("chain_id").notNull(),
    lastProcessedBlock: bigint("last_processed_block", { mode: "number" }).notNull(),
  },
  t => [
    primaryKey({ columns: [t.chainId, t.address] }),
  ]
);

export const positions = pgTable(
  "positions",
  {
    amountInRaw: numeric("amount_in_raw", { precision: 78, scale: 0 }),
    amountOutRaw: numeric("amount_out_raw", { precision: 78, scale: 0 }),
    asset: varchar("asset", { length: 42 }).notNull(),
    assetDecimals: integer("asset_decimals").notNull(),
    chainId: integer("chain_id").notNull(),
    closedAt: timestamp("closed_at", { withTimezone: false }),
    closePriceUsd: numeric("close_price_usd", { precision: 38, scale: 18 }),
    closeTx: varchar("close_tx", { length: 66 }),
    id: varchar("id", { length: 160 }).primaryKey(),
    openedAt: timestamp("opened_at", { withTimezone: false }).notNull(),
    pnlUsd: numeric("pnl_usd", { precision: 38, scale: 6 }),
    status: positionStatus("status").notNull().default("open"),
    strategyId: bigint("strategy_id", { mode: "bigint" }).notNull(),
    user: varchar("user", { length: 42 }).notNull(),
    vault: varchar("vault", { length: 42 }).notNull(),
  },
  t => [
    index("positions_chain_vault_user_idx").on(t.chainId, t.vault, t.user),
  ]
);

export const prices = pgTable(
  "prices",
  {
    asset: varchar("asset", { length: 42 }).notNull(),
    priceUsd: numeric("price_usd", { precision: 38, scale: 18 }).notNull(),
    source: varchar("source", { length: 32 }).notNull(),
    tsMinute: timestamp("ts_minute", { withTimezone: false }).notNull(),
  },
  t => [
    primaryKey({ columns: [t.asset, t.source, t.tsMinute] }),
  ]
);

export const schema = {
  checkpoints,
  events,
  positions,
  positionStatus,
  prices,
  vaults,
};

export type IndexerDb = NodePgDatabase<IndexerSchema>;
export type IndexerSchema = typeof schema;

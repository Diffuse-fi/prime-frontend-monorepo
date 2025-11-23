import {
  pgTable,
  varchar,
  integer,
  bigint,
  jsonb,
  timestamp,
  numeric,
  index,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export const positionStatus = pgEnum("position_status", ["open", "closed"]);

export const vaults = pgTable(
  "vaults",
  {
    id: varchar("id", { length: 66 }).primaryKey(),
    chainId: integer("chain_id").notNull(),
    vault: varchar("vault", { length: 42 }),
    asset: varchar("asset", { length: 42 }),
    symbol: varchar("symbol", { length: 16 }),
    decimals: integer("decimals"),
    discoveredAt: timestamp("discovered_at", { withTimezone: false }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false }).notNull(),
  },
  t => [
    index("vaults_chain_idx").on(t.chainId),
  ]
);

export const events = pgTable(
  "events",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    chainId: integer("chain_id").notNull(),
    contract: varchar("contract", { length: 42 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    blockNumber: bigint("block_number", { mode: "number" }).notNull(),
    txHash: varchar("tx_hash", { length: 66 }).notNull(),
    logIndex: integer("log_index").notNull(),
    blockHash: varchar("block_hash", { length: 66 }).notNull(),
    ts: timestamp("ts", { withTimezone: false }).notNull(),
    args: jsonb("args").notNull(),
  },
  t => [
    index("events_contract_block_idx").on(t.contract, t.blockNumber),
    index("events_name_ts_idx").on(t.name, t.ts),
  ]
);

export const checkpoints = pgTable(
  "checkpoints",
  {
    chainId: integer("chain_id").notNull(),
    address: varchar("address", { length: 42 }).notNull(),
    lastProcessedBlock: bigint("last_processed_block", { mode: "number" }).notNull(),
  },
  t => [
    primaryKey({ columns: [t.chainId, t.address] }),
  ]
);

export const positions = pgTable(
  "positions",
  {
    id: varchar("id", { length: 160 }).primaryKey(),
    chainId: integer("chain_id").notNull(),
    vault: varchar("vault", { length: 42 }).notNull(),
    user: varchar("user", { length: 42 }).notNull(),
    strategyId: bigint("strategy_id", { mode: "bigint" }).notNull(),
    asset: varchar("asset", { length: 42 }).notNull(),
    assetDecimals: integer("asset_decimals").notNull(),
    status: positionStatus("status").notNull().default("open"),
    openedAt: timestamp("opened_at", { withTimezone: false }).notNull(),
    closedAt: timestamp("closed_at", { withTimezone: false }),
    amountInRaw: numeric("amount_in_raw", { precision: 78, scale: 0 }),
    amountOutRaw: numeric("amount_out_raw", { precision: 78, scale: 0 }),
    closeTx: varchar("close_tx", { length: 66 }),
    closePriceUsd: numeric("close_price_usd", { precision: 38, scale: 18 }),
    pnlUsd: numeric("pnl_usd", { precision: 38, scale: 6 }),
  },
  t => [
    index("positions_chain_vault_user_idx").on(t.chainId, t.vault, t.user),
    index("positions_chain_vault_user_idx").on(t.chainId, t.vault, t.user),
  ]
);

export const prices = pgTable(
  "prices",
  {
    asset: varchar("asset", { length: 42 }).notNull(),
    source: varchar("source", { length: 32 }).notNull(),
    tsMinute: timestamp("ts_minute", { withTimezone: false }).notNull(),
    priceUsd: numeric("price_usd", { precision: 38, scale: 18 }).notNull(),
  },
  t => [
    index("prices_asset_source_tsmin_idx").on(t.asset, t.source, t.tsMinute),
  ]
);

export const schema = {
  positionStatus,
  vaults,
  events,
  checkpoints,
  positions,
  prices,
};

export type IndexerSchema = typeof schema;
export type IndexerDb = NodePgDatabase<IndexerSchema>;

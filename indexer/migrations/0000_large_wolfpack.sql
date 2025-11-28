CREATE TYPE "public"."position_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "checkpoints" (
	"chain_id" integer NOT NULL,
	"address" varchar(42) NOT NULL,
	"last_processed_block" bigint NOT NULL,
	CONSTRAINT "checkpoints_chain_id_address_pk" PRIMARY KEY("chain_id","address")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"chain_id" integer NOT NULL,
	"contract" varchar(42) NOT NULL,
	"name" varchar(64) NOT NULL,
	"block_number" bigint NOT NULL,
	"tx_hash" varchar(66) NOT NULL,
	"log_index" integer NOT NULL,
	"block_hash" varchar(66) NOT NULL,
	"ts" timestamp NOT NULL,
	"args" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" varchar(160) PRIMARY KEY NOT NULL,
	"chain_id" integer NOT NULL,
	"vault" varchar(42) NOT NULL,
	"user" varchar(42) NOT NULL,
	"strategy_id" bigint NOT NULL,
	"asset" varchar(42) NOT NULL,
	"asset_decimals" integer NOT NULL,
	"status" "position_status" DEFAULT 'open' NOT NULL,
	"opened_at" timestamp NOT NULL,
	"closed_at" timestamp,
	"amount_in_raw" numeric(78, 0),
	"amount_out_raw" numeric(78, 0),
	"close_tx" varchar(66),
	"close_price_usd" numeric(38, 18),
	"pnl_usd" numeric(38, 6)
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"asset" varchar(42) NOT NULL,
	"source" varchar(32) NOT NULL,
	"ts_minute" timestamp NOT NULL,
	"price_usd" numeric(38, 18) NOT NULL,
	CONSTRAINT "prices_asset_source_ts_minute_pk" PRIMARY KEY("asset","source","ts_minute")
);
--> statement-breakpoint
CREATE TABLE "vaults" (
	"id" varchar(66) PRIMARY KEY NOT NULL,
	"chain_id" integer NOT NULL,
	"vault" varchar(42),
	"asset" varchar(42),
	"symbol" varchar(16),
	"decimals" integer,
	"discovered_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "events_contract_block_idx" ON "events" USING btree ("contract","block_number");--> statement-breakpoint
CREATE INDEX "events_name_ts_idx" ON "events" USING btree ("name","ts");--> statement-breakpoint
CREATE INDEX "positions_chain_vault_user_idx" ON "positions" USING btree ("chain_id","vault","user");--> statement-breakpoint
CREATE INDEX "vaults_chain_idx" ON "vaults" USING btree ("chain_id");
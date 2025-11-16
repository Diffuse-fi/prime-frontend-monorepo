import { db } from "./db";
import { events, checkpoints, positions } from "./schema";
import { eq } from "drizzle-orm";

export async function upsertEvents(
  rows: Array<{
    id: string;
    chainId: number;
    contract: string;
    name: string;
    blockNumber: number;
    txHash: `0x${string}`;
    logIndex: number;
    blockHash: `0x${string}`;
    ts: Date;
    args: any;
  }>
) {
  if (!rows.length) return;
  await db.insert(events).values(rows).onConflictDoNothing();
}

export async function setCheckpoint(chainId: number, address: string, block: number) {
  await db
    .insert(checkpoints)
    .values({ chainId, address, lastProcessedBlock: block })
    .onConflictDoUpdate({
      target: [checkpoints.chainId, checkpoints.address],
      set: { lastProcessedBlock: block },
    });
}

export async function markPositionOpened(v: {
  id: string;
  chainId: number;
  vault: string;
  user: string;
  strategyId: bigint;
  openedAt: Date;
  asset: string;
  assetDecimals: number;
}) {
  await db
    .insert(positions)
    .values({
      id: v.id,
      chainId: v.chainId,
      vault: v.vault,
      user: v.user,
      strategyId: v.strategyId,
      openedAt: v.openedAt,
      status: "open",
      asset: v.asset,
      assetDecimals: v.assetDecimals,
    })
    .onConflictDoNothing();
}

export async function markPositionClosed(
  id: string,
  v: {
    closedAt: Date;
    closeTx: `0x${string}`;
    closePriceUsd?: string;
    pnlUsd?: string;
  }
) {
  await db
    .update(positions)
    .set({
      status: "closed",
      closedAt: v.closedAt,
      closeTx: v.closeTx,
      closePriceUsd: v.closePriceUsd,
      pnlUsd: v.pnlUsd,
    })
    .where(eq(positions.id, id));
}

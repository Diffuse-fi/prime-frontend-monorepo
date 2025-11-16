import { db } from "@/db/db";
import { vaults } from "@/db/schema";
import { getViewerForChainId } from "./viewer";
import { getAddress } from "viem";

export async function discoverVaults(chainId: number) {
  const viewer = getViewerForChainId(chainId);
  const list = await viewer.getVaults();

  const now = new Date();

  for (const v of list) {
    await db
      .insert(vaults)
      .values({
        id: `${chainId}:${getAddress(v.vault)}`,
        chainId,
        address: getAddress(v.vault),
        asset: v.asset?.toLowerCase() ?? null,
        symbol: v.symbol ?? null,
        decimals: v.decimals ?? null,
        isActive: true,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: vaults.id,
        set: {
          asset: v.asset?.toLowerCase() ?? null,
          symbol: v.symbol ?? null,
          decimals: v.decimals ?? null,
          isActive: true,
          updatedAt: now,
        },
      });
  }

  // Return normalized addresses for immediate use
  return list.map(v => v.vault.toLowerCase());
}

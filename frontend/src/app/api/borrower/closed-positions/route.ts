import { NextRequest, NextResponse } from "next/server";
import { getClosedPositionsForUser } from "@diffuse/indexer/src/db/reads";
import { mapClosedPositions } from "@diffuse/indexer/src/api/mapClosedPosition";
import { getViewerForChainId } from "@diffuse/indexer/src/config/viewer";
import { isAddress } from "viem";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const user = (searchParams.get("user") ?? "").toLowerCase();

  if (!isAddress(user)) {
    return NextResponse.json({ error: "Invalid user address" }, { status: 400 });
  }

  const chainId = Number(searchParams.get("chainId"));

  if (isNaN(chainId)) {
    return NextResponse.json({ error: "Invalid chainId" }, { status: 400 });
  }

  const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit") ?? 50)));
  const cursorStr = searchParams.get("cursor") || undefined;
  const cursor = cursorStr
    ? (JSON.parse(cursorStr) as { closedAt: string; id: string })
    : undefined;

  // 1) Read closed positions from indexer DB
  const { items, nextCursor } = await getClosedPositionsForUser(user, limit, cursor);

  // 2) Enrich with SDK Viewer (vault & asset info)
  const viewer = getViewerForChainId(chainId);
  const mapped = await mapClosedPositions(items, viewer);

  return NextResponse.json({ items: mapped, nextCursor }, { status: 200 });
}

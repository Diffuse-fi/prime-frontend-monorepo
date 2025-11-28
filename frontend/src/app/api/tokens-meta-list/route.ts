import { NextRequest, NextResponse } from "next/server";
import { getTokenMetaList } from "@/lib/assets/assetsMeta";
import { QuerySchema } from "./validations";
import * as Sentry from "@sentry/nextjs";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { chains } = QuerySchema.parse({
      chains: searchParams.get("chains") ?? undefined,
    });

    const list = await getTokenMetaList();

    if (chains?.length === 0) {
      return NextResponse.json(list, {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
          "X-Asset-Count": String(list.length),
        },
      });
    }

    const filteredList = chains ? list.filter(t => chains.includes(t.chainId)) : list;

    return NextResponse.json(filteredList, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
        "X-Asset-Count": String(filteredList.length),
      },
    });
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

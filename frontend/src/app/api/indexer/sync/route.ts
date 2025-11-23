import { NextRequest, NextResponse } from "next/server";
import { indexer } from "@/lib/indexer";
import { env } from "@/env";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!env.CRON_SECRET || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const isVercelProd = env.VERCEL_ENV === "production";
  // Skip sync on preview deployments to avoid excessive load on the database
  if (!isVercelProd) {
    return NextResponse.json({
      status: "ok",
      message: "Skipping indexer sync on Vercel preview deployments",
    });
  }

  if (!indexer) {
    return NextResponse.json(
      { status: "error", message: "Indexer not initialized" },
      { status: 500 }
    );
  }

  try {
    await indexer.syncAll();
    return NextResponse.json({ status: "ok" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

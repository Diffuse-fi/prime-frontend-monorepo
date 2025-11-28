import { NextRequest, NextResponse } from "next/server";
import { indexer } from "@/lib/indexer";
import { env } from "@/env";
import * as Sentry from "@sentry/nextjs";
import { safeEqual } from "@/lib/security/constantTime";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!env.CRON_SECRET) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const expected = `Bearer ${env.CRON_SECRET}`;
  if (!safeEqual(authHeader, expected)) {
    return new Response("Unauthorized", { status: 401 });
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
    const message = "Indexer not initialized";
    Sentry.captureMessage(message);
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }

  try {
    await indexer.syncAll();
    return NextResponse.json({ status: "ok" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    Sentry.captureException(e);
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

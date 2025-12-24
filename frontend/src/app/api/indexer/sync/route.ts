import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import { indexer } from "@/lib/indexer";
import { isIndexerEnabled } from "@/lib/indexer/isEnabled";
import { safeEqual } from "@/lib/security/constantTime";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!env.CRON_SECRET) {
    Sentry.captureMessage("Server misconfigured");
    return new Response("Server misconfigured", { status: 500 });
  }

  const expected = `Bearer ${env.CRON_SECRET}`;
  if (!safeEqual(authHeader, expected)) {
    Sentry.captureMessage("Unauthorized");
    return new Response("Unauthorized", { status: 401 });
  }

  const isVercelProd = env.VERCEL_ENV === "production";
  // Skip sync on preview deployments to avoid excessive load on the database
  if (!isVercelProd) {
    return NextResponse.json({
      message: "Skipping indexer sync on Vercel preview deployments",
      status: "ok",
    });
  }

  if (!isIndexerEnabled()) {
    return NextResponse.json(
      { message: "Indexer is not enabled", status: "error" },
      { status: 500 }
    );
  }

  if (!indexer) {
    const message = "Indexer not initialized";
    Sentry.captureMessage(message);
    return NextResponse.json({ message, status: "error" }, { status: 500 });
  }

  try {
    await indexer.syncAll();
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    Sentry.captureException(error);
    return NextResponse.json({ message, status: "error" }, { status: 500 });
  }
}

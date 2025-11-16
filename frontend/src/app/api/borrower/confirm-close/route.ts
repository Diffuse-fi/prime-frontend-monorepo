import { sameOriginOnlyCorsHeaders } from "@/lib/misc/cors";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    headers: sameOriginOnlyCorsHeaders(req.headers.get("origin") || undefined),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || undefined;

  return new NextResponse(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: sameOriginOnlyCorsHeaders(origin),
  });
}

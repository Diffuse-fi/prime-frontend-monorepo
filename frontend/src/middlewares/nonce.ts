import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

export function withNonce(req: NextRequest) {
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString(
    "base64"
  );
  const headers = new Headers(req.headers);
  headers.set("x-csp-nonce", nonce);

  const res = NextResponse.next({ request: { headers } });
  res.headers.set(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none';`
  );
  return res;
}

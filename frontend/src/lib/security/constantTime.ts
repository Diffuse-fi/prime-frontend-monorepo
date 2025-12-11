import crypto from "node:crypto";

export function safeEqual(a: null | string, b: string): boolean {
  if (a === null) return false;

  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuf, bBuf);
}

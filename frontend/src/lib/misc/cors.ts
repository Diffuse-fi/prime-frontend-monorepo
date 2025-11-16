import { env } from "@/env";

export function sameOriginOnlyCorsHeaders(origin?: string) {
  const allowed = origin && origin === env.ORIGIN ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
    Vary: "Origin",
  };
}

import { env } from "@/env";

export function isIndexerEnabled(): boolean {
  return env.NEXT_PUBLIC_ENABLE_INDEXER ?? false;
}

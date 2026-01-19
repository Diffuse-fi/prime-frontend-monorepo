export function makeIdempotencyKey(...parts: unknown[]): string {
  return parts.map(String).join(":");
}

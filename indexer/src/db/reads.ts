import { db } from "./db";
import { positions } from "./schema";
import { and, desc, eq } from "drizzle-orm";

export async function getClosedPositions(user: string, limit = 50) {
  return db
    .select()
    .from(positions)
    .where(and(eq(positions.user, user), eq(positions.status, "closed")))
    .orderBy(desc(positions.closedAt))
    .limit(limit);
}

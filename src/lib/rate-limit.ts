import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

function hashedKey(scope: string, identity: string) {
  const salt = process.env.AUTH_SECRET;
  if (!salt || salt.length < 32) throw new Error("AUTH_SECRET is not configured.");
  return createHash("sha256").update(`${salt}:${scope}:${identity}`).digest("hex");
}

export function requestIdentity(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = request.headers.get("x-real-ip")?.trim();
  return forwarded || real || "unknown";
}

/** Atomic PostgreSQL counter. The raw IP is never stored. */
export async function consumeRateLimit(scope: string, identity: string, limit: number, windowSeconds: number) {
  const key = hashedKey(scope, identity);
  const resetAt = new Date(Date.now() + windowSeconds * 1000);
  const rows = await prisma.$queryRaw<Array<{ hits: number }>>`
    INSERT INTO "RateLimitBucket" ("id", "key", "hits", "resetAt")
    VALUES (${key}, ${key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "hits" = CASE WHEN "RateLimitBucket"."resetAt" <= NOW() THEN 1 ELSE "RateLimitBucket"."hits" + 1 END,
      "resetAt" = CASE WHEN "RateLimitBucket"."resetAt" <= NOW() THEN EXCLUDED."resetAt" ELSE "RateLimitBucket"."resetAt" END
    RETURNING "hits"
  `;
  // Opportunistic cleanup of expired buckets to keep the table bounded.
  if (Math.random() < 0.02) {
    await prisma.rateLimitBucket.deleteMany({ where: { resetAt: { lt: new Date(Date.now() - 60 * 60 * 1000) } } });
  }
  return (rows[0]?.hits ?? limit + 1) <= limit;
}

CREATE TABLE "AccountInvite" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL, "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AccountInvite_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AccountInvite_tokenHash_key" ON "AccountInvite"("tokenHash");
CREATE INDEX "AccountInvite_userId_expiresAt_idx" ON "AccountInvite"("userId", "expiresAt");
ALTER TABLE "AccountInvite" ADD CONSTRAINT "AccountInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

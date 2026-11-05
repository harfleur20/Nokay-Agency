import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, requestIdentity } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try { if (!await consumeRateLimit("reset-password", requestIdentity(request), 5, 15 * 60)) return NextResponse.json({ error: "rate_limited" }, { status: 429 }); }
  catch { return NextResponse.json({ error: "service_unavailable" }, { status: 503 }); }
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const token = typeof body.token === "string" ? body.token.slice(0, 200) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (token.length < 32 || password.length < 12 || password.length > 200) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  const tokenHash = createHash("sha256").update(token).digest("hex");
  try {
    const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: true } });
    if (!reset || reset.usedAt || reset.expiresAt <= new Date() || !reset.user.active || reset.user.role !== "CLIENT") return NextResponse.json({ error: "token_invalid_or_expired" }, { status: 400 });
    const passwordHash = await hash(password, 12);
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.passwordResetToken.updateMany({ where: { id: reset.id, usedAt: null, expiresAt: { gt: new Date() } }, data: { usedAt: new Date() } });
      if (claimed.count !== 1) throw new Error("RESET_TOKEN_USED");
      await tx.user.update({ where: { id: reset.userId }, data: { passwordHash } });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "RESET_TOKEN_USED") return NextResponse.json({ error: "token_invalid_or_expired" }, { status: 400 });
    console.error("NOKAY password reset failed", error);
    return NextResponse.json({ error: "reset_failed" }, { status: 500 });
  }
}

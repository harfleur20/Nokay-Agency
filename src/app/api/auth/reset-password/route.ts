import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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
      const current = await tx.passwordResetToken.findUnique({ where: { id: reset.id } });
      if (!current || current.usedAt || current.expiresAt <= new Date()) throw new Error("RESET_TOKEN_USED");
      await tx.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } });
      await tx.user.update({ where: { id: reset.userId }, data: { passwordHash } });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "RESET_TOKEN_USED") return NextResponse.json({ error: "token_invalid_or_expired" }, { status: 400 });
    console.error("NOKAY password reset failed", error);
    return NextResponse.json({ error: "reset_failed" }, { status: 500 });
  }
}

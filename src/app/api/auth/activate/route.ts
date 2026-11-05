import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { consumeRateLimit, requestIdentity } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try { if (!await consumeRateLimit("account-activation", requestIdentity(request), 5, 15 * 60)) return NextResponse.json({ error: "rate_limited" }, { status: 429 }); }
  catch { return NextResponse.json({ error: "service_unavailable" }, { status: 503 }); }
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const token = typeof body.token === "string" ? body.token.slice(0, 200) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (token.length < 32 || password.length < 12 || password.length > 200) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  const tokenHash = createHash("sha256").update(token).digest("hex");
  try {
    const invite = await prisma.accountInvite.findUnique({ where: { tokenHash }, include: { user: true } });
    if (!invite || invite.usedAt || invite.expiresAt <= new Date()) return NextResponse.json({ error: "invite_invalid_or_expired" }, { status: 400 });
    const passwordHash = await hash(password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const current = await tx.accountInvite.findUnique({ where: { id: invite.id } });
      if (!current || current.usedAt || current.expiresAt <= new Date()) throw new Error("INVITE_ALREADY_USED");
      await tx.accountInvite.update({ where: { id: invite.id }, data: { usedAt: new Date() } });
      return tx.user.update({ where: { id: invite.userId }, data: { passwordHash, active: true } });
    });
    await createSession({ id:user.id, role:user.role, name:user.name, email:user.email });
    return NextResponse.json({ ok:true });
  } catch (error) {
    if (error instanceof Error && error.message === "INVITE_ALREADY_USED") return NextResponse.json({ error: "invite_invalid_or_expired" }, { status: 400 });
    console.error("NOKAY account activation failed",error);
    return NextResponse.json({ error: "activation_failed" }, { status: 500 });
  }
}

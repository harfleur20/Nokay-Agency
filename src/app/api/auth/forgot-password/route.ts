import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, requestIdentity } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!await consumeRateLimit("forgot-password", requestIdentity(request), 5, 15 * 60)) return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: true }); }

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: true }); }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: true });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user?.active && user.role === UserRole.CLIENT) {
      const apiKey = process.env.RESEND_API_KEY;
      const sender = process.env.RESEND_FROM_EMAIL;
      const recipient = process.env.CONTACT_EMAIL;
      if (apiKey && sender && recipient) {
        const token = randomBytes(32).toString("base64url");
        const tokenHash = createHash("sha256").update(token).digest("hex");
        await prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { expiresAt: new Date() } });
        const reset = await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
        const baseUrl = (process.env.AUTH_URL || new URL(request.url).origin).replace(/\/$/, "");
        const resetUrl = `${baseUrl}/account/reset-password?token=${encodeURIComponent(token)}`;
        const sent = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: sender, to: [user.email], reply_to: recipient, subject: "NOKAY — Réinitialisation de votre mot de passe", text: `Bonjour ${user.name},\n\nPour choisir un nouveau mot de passe, utilisez ce lien valable une heure :\n${resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.\nL'équipe NOKAY` }),
        });
        if (!sent.ok) await prisma.passwordResetToken.delete({ where: { id: reset.id } });
      }
    }
  } catch (error) {
    console.error("NOKAY password reset request failed", error);
  }
  return NextResponse.json({ ok: true });
}

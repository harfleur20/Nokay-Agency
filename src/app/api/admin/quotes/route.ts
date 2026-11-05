import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { QuoteStatus, UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [quotes, leads] = await Promise.all([
    prisma.quote.findMany({ include: { client: { select: { name: true, email: true } }, lead: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.lead.findMany({ where: { status: { notIn: ["LOST", "ARCHIVED"] } }, select: { id: true, name: true, email: true, company: true, service: true }, orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  return NextResponse.json({ quotes, leads });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const leadId = clean(body.leadId, 100);
  const title = clean(body.title, 160);
  const description = clean(body.description, 4000);
  const amountCents = typeof body.amountCents === "number" ? body.amountCents : Number.NaN;
  const validUntilValue = clean(body.validUntil, 40);
  const validUntil = validUntilValue ? new Date(validUntilValue) : null;
  if (!leadId || title.length < 3 || !Number.isSafeInteger(amountCents) || amountCents < 100 || amountCents > 100000000 ||
      (validUntilValue && (!validUntil || Number.isNaN(validUntil.getTime())))) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return NextResponse.json({ error: "lead_not_found" }, { status: 404 });

  try {
    const temporaryPassword = randomBytes(48).toString("base64url");
    const passwordHash = await hash(temporaryPassword, 12);
    const client = await prisma.user.upsert({
      where: { email: lead.email.toLowerCase() },
      update: {},
      create: { name: lead.name, email: lead.email.toLowerCase(), passwordHash, role: UserRole.CLIENT, active: false },
    });
    const reference = `NK-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const quote = await prisma.quote.create({
      data: { reference, clientId: client.id, leadId: lead.id, title, description: description || null, amountCents, validUntil, status: QuoteStatus.DRAFT },
      include: { client: { select: { name: true, email: true } }, lead: { select: { name: true, email: true } } },
    });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "quote.created", entity: "Quote", entityId: quote.id, metadata: { reference, leadId, amountCents } } });
    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("NOKAY quote creation failed", error);
    return NextResponse.json({ error: "quote_creation_failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const id = clean(body.id, 100);
  const status = clean(body.status, 20);
  if (!id || !Object.values(QuoteStatus).includes(status as QuoteStatus)) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  try {
    const existing = await prisma.quote.findUnique({ where: { id }, include: { client: true } });
    if (!existing) return NextResponse.json({ error: "quote_not_found" }, { status: 404 });

    if (status === QuoteStatus.SENT) {
      const apiKey = process.env.RESEND_API_KEY;
      const recipient = process.env.CONTACT_EMAIL;
      const sender = process.env.RESEND_FROM_EMAIL;
      if (!apiKey || !recipient || !sender) return NextResponse.json({ error: "email_not_configured" }, { status: 503 });
      const amount = (existing.amountCents / 100).toLocaleString("fr-FR", { style: "currency", currency: existing.currency });
      let activationUrl = "";
      let inviteId = "";
      if (!existing.client.active) {
        const token = randomBytes(32).toString("base64url");
        const tokenHash = createHash("sha256").update(token).digest("hex");
        await prisma.accountInvite.updateMany({ where: { userId: existing.client.id, usedAt: null }, data: { expiresAt: new Date() } });
        const invite = await prisma.accountInvite.create({ data: { userId: existing.client.id, tokenHash, expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000) } });
        inviteId = invite.id;
        const baseUrl = (process.env.AUTH_URL || new URL(request.url).origin).replace(/\\/$/, "");
        activationUrl = `${baseUrl}/account/activate?token=${encodeURIComponent(token)}`;
      }
      const text = [
        `Bonjour ${existing.client.name},`,
        "",
        "Veuillez trouver ci-dessous votre proposition commerciale NOKAY.",
        `Référence : ${existing.reference}`,
        `Projet : ${existing.title}`,
        `Montant : ${amount} HT`,
        existing.description || "",
        existing.validUntil ? `Offre valable jusqu'au ${existing.validUntil.toLocaleDateString("fr-FR")}.` : "",
        activationUrl ? "" : "",
        activationUrl ? "Votre espace client est prêt. Activez-le avec le lien personnel ci-dessous (valable 72 heures) :" : "",
        activationUrl,
        "",
        "Pour toute question, répondez directement à cet e-mail.",
        "L'équipe NOKAY",
      ].filter(Boolean).join("\\n");
      const sent = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: sender, to: [existing.client.email], reply_to: recipient, subject: `NOKAY — Votre proposition ${existing.reference}`, text }),
      });
      if (!sent.ok) {
        if (inviteId) await prisma.accountInvite.delete({ where: { id: inviteId } });
        return NextResponse.json({ error: "quote_email_failed" }, { status: 502 });
      }
    }

    const quote = await prisma.quote.update({ where: { id }, data: { status: status as QuoteStatus } });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: status === QuoteStatus.SENT ? "quote.sent" : "quote.status.updated", entity: "Quote", entityId: id, metadata: { status } } });
    return NextResponse.json({ ok: true, status: quote.status });
  } catch (error) {
    console.error("NOKAY quote status update failed", error);
    return NextResponse.json({ error: "quote_update_failed" }, { status: 500 });
  }
}

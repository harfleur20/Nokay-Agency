import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
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
    const quote = await prisma.quote.update({ where: { id }, data: { status: status as QuoteStatus } });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "quote.status.updated", entity: "Quote", entityId: id, metadata: { status } } });
    return NextResponse.json({ ok: true, status: quote.status });
  } catch { return NextResponse.json({ error: "quote_not_found" }, { status: 404 }); }
}

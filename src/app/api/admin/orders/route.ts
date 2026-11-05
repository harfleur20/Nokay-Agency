import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { QuoteStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { requireRoles } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const admin = await requireRoles(["SUPER_ADMIN", "ADMIN"]);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const quoteId = typeof body.quoteId === "string" ? body.quoteId : "";
  const depositCents = typeof body.depositCents === "number" ? body.depositCents : null;
  if (!quoteId || (depositCents !== null && (!Number.isSafeInteger(depositCents) || depositCents < 0))) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote || quote.status !== QuoteStatus.ACCEPTED) return NextResponse.json({ error: "quote_must_be_accepted" }, { status: 409 });
  if (depositCents !== null && depositCents > quote.amountCents) return NextResponse.json({ error: "invalid_deposit" }, { status: 400 });
  try {
    const order = await prisma.order.create({
      data: { reference: `CMD-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`, clientId: quote.clientId, quoteId: quote.id, title: quote.title, amountCents: quote.amountCents, depositCents },
    });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "order.created", entity: "Order", entityId: order.id, metadata: { quoteId, depositCents } } });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("NOKAY order creation failed", error);
    return NextResponse.json({ error: "order_creation_failed" }, { status: 500 });
  }
}

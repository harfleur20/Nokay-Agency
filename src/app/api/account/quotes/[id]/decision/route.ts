import { NextResponse } from "next/server";
import { QuoteStatus } from "@prisma/client";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = await requireClient();
  if (!client) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const decision = body.decision;
  if (!id || ![ "accept", "reject" ].includes(String(decision))) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  const result = await prisma.quote.updateMany({
    where: { id, clientId: client.id, status: QuoteStatus.SENT, OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }] },
    data: { status: decision === "accept" ? QuoteStatus.ACCEPTED : QuoteStatus.REJECTED, acceptedAt: decision === "accept" ? new Date() : null },
  });
  if (result.count !== 1) return NextResponse.json({ error: "quote_not_available" }, { status: 404 });
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) return NextResponse.json({ error: "quote_not_available" }, { status: 404 });
  await prisma.auditLog.create({ data: { actorId: client.id, action: decision === "accept" ? "quote.accepted" : "quote.rejected", entity: "Quote", entityId: quote.id } });
  const apiKey = process.env.RESEND_API_KEY; const sender = process.env.RESEND_FROM_EMAIL; const recipient = process.env.CONTACT_EMAIL;
  if (apiKey && sender && recipient) {
    const text = `Le client ${client.name} (${client.email}) a ${decision === "accept" ? "accepté" : "refusé"} le devis ${quote.reference} — ${quote.title}.`;
    await fetch("https://api.resend.com/emails", { method:"POST", headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"}, body:JSON.stringify({from:sender,to:[recipient],reply_to:client.email,subject:`NOKAY — Réponse au devis ${quote.reference}`,text}) }).catch((error)=>console.error("NOKAY quote decision notification failed",error));
  }
  return NextResponse.json({ ok:true, status:quote.status });
}

import { NextResponse } from "next/server";
import { LeadStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, name: true, email: true, company: true, service: true, budget: true, message: true, status: true, createdAt: true },
  });
  return NextResponse.json({ leads });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!id || !Object.values(LeadStatus).includes(status as LeadStatus)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  const lead = await prisma.lead.update({ where: { id }, data: { status: status as LeadStatus } });
  await prisma.auditLog.create({ data: { actorId: admin.id, action: "lead.status.updated", entity: "Lead", entityId: lead.id, metadata: { status } } });
  return NextResponse.json({ ok: true, id: lead.id, status: lead.status });
}

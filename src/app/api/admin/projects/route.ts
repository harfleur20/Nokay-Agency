import { NextResponse } from "next/server";
import { ProjectStatus, UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [projects, clients] = await Promise.all([
    prisma.project.findMany({ include: { client: { select: { id: true, name: true, email: true } }, order: { select: { reference: true } }, updates: { orderBy: { createdAt: "desc" }, take: 3 } }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.user.findMany({ where: { role: UserRole.CLIENT }, select: { id: true, name: true, email: true }, orderBy: { name: "asc" }, take: 500 }),
  ]);
  return NextResponse.json({ projects, clients });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const clientId = clean(body.clientId, 100);
  const name = clean(body.name, 160);
  const description = clean(body.description, 4000);
  const startDate = typeof body.startDate === "string" && body.startDate ? new Date(body.startDate) : null;
  const dueDate = typeof body.dueDate === "string" && body.dueDate ? new Date(body.dueDate) : null;
  if (!clientId || name.length < 3 || (startDate && Number.isNaN(startDate.getTime())) || (dueDate && Number.isNaN(dueDate.getTime()))) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  const client = await prisma.user.findUnique({ where: { id: clientId }, select: { id: true, role: true } });
  if (!client || client.role !== UserRole.CLIENT) return NextResponse.json({ error: "client_not_found" }, { status: 404 });
  const project = await prisma.project.create({ data: { clientId, name, description: description || null, startDate, dueDate } , include: { client: { select: { name: true, email: true } } } });
  await prisma.auditLog.create({ data: { actorId: admin.id, action: "project.created", entity: "Project", entityId: project.id } });
  return NextResponse.json({ project }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const id = clean(body.id, 100);
  const data: { status?: ProjectStatus; progress?: number; dueDate?: Date | null } = {};
  if (typeof body.status === "string" && Object.values(ProjectStatus).includes(body.status as ProjectStatus)) data.status = body.status as ProjectStatus;
  if (typeof body.progress === "number" && Number.isInteger(body.progress)) data.progress = Math.max(0, Math.min(100, body.progress));
  if (typeof body.dueDate === "string") data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (!id || Object.keys(data).length === 0 || (data.dueDate && Number.isNaN(data.dueDate.getTime()))) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  try {
    const project = await prisma.project.update({ where: { id }, data });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "project.updated", entity: "Project", entityId: id, metadata: data } });
    return NextResponse.json({ ok: true, project });
  } catch { return NextResponse.json({ error: "project_not_found" }, { status: 404 }); }
}

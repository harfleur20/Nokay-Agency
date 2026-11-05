import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const services = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { nameFr: "asc" }] });
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const slug = clean(body.slug, 80).toLowerCase();
  const nameFr = clean(body.nameFr, 120);
  const nameEn = clean(body.nameEn, 120);
  const descriptionFr = clean(body.descriptionFr, 2000);
  const descriptionEn = clean(body.descriptionEn, 2000);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || nameFr.length < 2 || nameEn.length < 2) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  try {
    const service = await prisma.service.create({ data: { slug, nameFr, nameEn, descriptionFr: descriptionFr || null, descriptionEn: descriptionEn || null } });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "service.created", entity: "Service", entityId: service.id } });
    return NextResponse.json({ service }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "service_already_exists_or_database_error" }, { status: 409 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const id = clean(body.id, 100);
  if (!id) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  const data: { nameFr?: string; nameEn?: string; descriptionFr?: string | null; descriptionEn?: string | null; active?: boolean; sortOrder?: number } = {};
  if (typeof body.nameFr === "string") data.nameFr = clean(body.nameFr, 120);
  if (typeof body.nameEn === "string") data.nameEn = clean(body.nameEn, 120);
  if (typeof body.descriptionFr === "string") data.descriptionFr = clean(body.descriptionFr, 2000) || null;
  if (typeof body.descriptionEn === "string") data.descriptionEn = clean(body.descriptionEn, 2000) || null;
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.sortOrder === "number" && Number.isInteger(body.sortOrder)) data.sortOrder = Math.max(0, Math.min(999, body.sortOrder));
  try {
    const service = await prisma.service.update({ where: { id }, data });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "service.updated", entity: "Service", entityId: id, metadata: data } });
    return NextResponse.json({ service });
  } catch {
    return NextResponse.json({ error: "service_not_found_or_database_error" }, { status: 404 });
  }
}

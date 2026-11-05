import { NextResponse } from "next/server";
import { requireRoles } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const admin = await requireRoles(["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"]);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const projectId = typeof body.projectId === "string" ? body.projectId : "";
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 160) : "";
  const content = typeof body.body === "string" ? body.body.trim().slice(0, 4000) : "";
  const visibleToClient = body.visibleToClient !== false;
  if (!projectId || title.length < 3 || content.length < 5) return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  try {
    const update = await prisma.projectUpdate.create({ data: { projectId, title, body: content, visibleToClient } });
    await prisma.auditLog.create({ data: { actorId: admin.id, action: "project.update.created", entity: "ProjectUpdate", entityId: update.id, metadata: { projectId, visibleToClient } } });
    return NextResponse.json({ update }, { status: 201 });
  } catch { return NextResponse.json({ error: "project_not_found" }, { status: 404 }); }
}

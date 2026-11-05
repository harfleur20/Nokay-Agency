import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { consumeRateLimit, requestIdentity } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  try {
    const allowed = await consumeRateLimit("admin-login", requestIdentity(request), 5, 15 * 60);
    if (!allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  } catch (error) {
    console.error("NOKAY login rate limiter unavailable", error);
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_payload" }, { status: 400 }); }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1 || password.length > 200) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active || !["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }
    const valid = await compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    await createSession({ id: user.id, role: user.role, name: user.name, email: user.email });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("NOKAY admin login failed", error);
    return NextResponse.json({ error: "authentication_unavailable" }, { status: 503 });
  }
}

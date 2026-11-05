import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "nokay_session";
const SESSION_DURATION = 60 * 60 * 8;

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET doit contenir au moins 32 caractères.");
  return new TextEncoder().encode(secret);
}

export async function createSession(user: { id: string; role: string; name: string; email: string }) {
  const token = await new SignJWT({ role: user.role, name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.role !== "string") return null;
    return { userId: payload.sub, role: payload.role, name: String(payload.name || ""), email: String(payload.email || "") };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || !["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(session.role)) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, email: true, role: true, active: true } });
  if (!user?.active || !["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(user.role)) return null;
  return user;
}

export async function requireClient() {
  const session = await getSession();
  if (!session || session.role !== "CLIENT") return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, email: true, role: true, active: true } });
  if (!user?.active || user.role !== "CLIENT") return null;
  return user;
}

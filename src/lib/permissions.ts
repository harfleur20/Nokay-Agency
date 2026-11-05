import { requireAdmin } from "@/lib/auth";

export async function requireRoles(roles: string[]) {
  const user = await requireAdmin();
  if (!user || !roles.includes(user.role)) return null;
  return user;
}

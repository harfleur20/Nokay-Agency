import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "NOKAY Administrator";

  if (!email || !password) {
    console.info("ADMIN_EMAIL / ADMIN_PASSWORD absent : aucun compte administrateur créé.");
    return;
  }
  if (password.length < 14) {
    throw new Error("ADMIN_PASSWORD doit contenir au moins 14 caractères.");
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: UserRole.SUPER_ADMIN, active: true },
    create: { name, email, passwordHash, role: UserRole.SUPER_ADMIN },
  });
  console.info("Compte administrateur initial créé ou mis à jour.");
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });

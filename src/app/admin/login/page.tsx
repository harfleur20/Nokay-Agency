import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Connexion administration | NOKAY", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session && ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(session.role)) redirect("/admin");
  return <main className="admin-auth-page"><Link href="/" className="brand">NOKAY<span>.</span></Link><section><p className="eyebrow">ESPACE SÉCURISÉ / NOKAY</p><h1>Administration<span>.</span></h1><p>Connectez-vous pour gérer les demandes et les projets.</p><LoginForm /></section><Link href="/" className="admin-back">← Retour au site</Link></main>;
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ClientLoginForm } from "./login-form";

export const metadata = { title: "Espace client | NOKAY", robots: { index:false, follow:false } };

export default async function ClientLoginPage() {
  const session = await getSession();
  if (session?.role === "CLIENT") redirect("/account");
  return <main className="admin-auth-page"><Link href="/" className="brand">NOKAY<span>.</span></Link><section><p className="eyebrow">ESPACE CLIENT / NOKAY</p><h1>Votre projet<span>.</span></h1><p>Connectez-vous pour suivre vos projets, devis et documents.</p><ClientLoginForm /></section><Link href="/" className="admin-back">← Retour au site</Link></main>;
}

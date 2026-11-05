import Link from "next/link";
import { ResetPasswordForm } from "./reset-form";

export const metadata = { title: "Réinitialiser le mot de passe | NOKAY", robots: { index:false, follow:false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = (params.token || "").slice(0,200);
  return <main className="admin-auth-page"><Link href="/" className="brand">NOKAY<span>.</span></Link><section><p className="eyebrow">SÉCURITÉ DU COMPTE / NOKAY</p><h1>Nouveau mot de passe<span>.</span></h1><p>Choisissez un mot de passe d'au moins 12 caractères.</p>{token ? <ResetPasswordForm token={token} /> : <p>Le lien est incomplet. Demandez une nouvelle réinitialisation.</p>}</section><Link href="/account/login" className="admin-back">← Retour à la connexion</Link></main>;
}

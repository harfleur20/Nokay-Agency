import Link from "next/link";
import { ActivateForm } from "./activate-form";

export const metadata = { title: "Activer mon espace | NOKAY", robots: { index:false, follow:false } };

export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = (params.token || "").slice(0,200);
  return <main className="admin-auth-page"><Link href="/" className="brand">NOKAY<span>.</span></Link><section><p className="eyebrow">PREMIÈRE CONNEXION / NOKAY</p><h1>Activez votre espace<span>.</span></h1><p>Choisissez un mot de passe d'au moins 12 caractères pour accéder à votre suivi de projet.</p>{token ? <ActivateForm token={token} /> : <p>Le lien d'activation est incomplet. Contactez NOKAY pour recevoir une nouvelle invitation.</p>}</section><Link href="/" className="admin-back">← Retour au site</Link></main>;
}

import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-form";

export const metadata = { title: "Mot de passe oublié | NOKAY", robots: { index:false, follow:false } };

export default function ForgotPasswordPage() {
  return <main className="admin-auth-page"><Link href="/" className="brand">NOKAY<span>.</span></Link><section><p className="eyebrow">AIDE À LA CONNEXION / NOKAY</p><h1>Mot de passe oublié<span>.</span></h1><p>Indiquez l'adresse e-mail de votre espace client. Si le compte existe, vous recevrez un lien sécurisé valable une heure.</p><ForgotPasswordForm /></section><Link href="/account/login" className="admin-back">← Retour à la connexion</Link></main>;
}

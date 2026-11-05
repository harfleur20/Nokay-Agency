import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { QuotesManager } from "./quotes-manager";

export const metadata = { title: "Devis | Administration NOKAY", robots: { index: false, follow: false } };

export default async function AdminQuotesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return <main className="admin-page"><header className="admin-topbar"><Link href="/" className="brand">NOKAY<span>.</span></Link><div><Link href="/admin">← Tableau de bord</Link><span>{admin.name}</span></div></header><section className="admin-content"><p className="eyebrow">VENTES / NOKAY</p><h1>Devis<span>.</span></h1><p className="admin-subtitle">Transformez les demandes entrantes en propositions commerciales.</p><QuotesManager /></section></main>;
}

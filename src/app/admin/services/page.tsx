import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/permissions";
import { ServicesManager } from "./services-manager";

export const metadata = { title: "Prestations | Administration NOKAY", robots: { index: false, follow: false } };

export default async function AdminServicesPage() {
  const admin = await requireRoles(["SUPER_ADMIN", "ADMIN"]);
  if (!admin) redirect("/admin");
  return <main className="admin-page"><header className="admin-topbar"><Link href="/" className="brand">NOKAY<span>.</span></Link><div><Link href="/admin">← Tableau de bord</Link><span>{admin.name}</span></div></header><section className="admin-content"><p className="eyebrow">CATALOGUE / NOKAY</p><h1>Prestations<span>.</span></h1><p className="admin-subtitle">Gérez les prestations disponibles dans votre catalogue interne.</p><ServicesManager /></section></main>;
}

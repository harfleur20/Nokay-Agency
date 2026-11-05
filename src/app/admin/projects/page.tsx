import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ProjectsManager } from "./projects-manager";

export const metadata = { title: "Projets | Administration NOKAY", robots: { index: false, follow: false } };

export default async function AdminProjectsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return <main className="admin-page"><header className="admin-topbar"><Link href="/" className="brand">NOKAY<span>.</span></Link><div><Link href="/admin">← Tableau de bord</Link><span>{admin.name}</span></div></header><section className="admin-content"><p className="eyebrow">PRODUCTION / NOKAY</p><h1>Projets<span>.</span></h1><p className="admin-subtitle">Pilotez les étapes, la progression et les actualités envoyées aux clients.</p><ProjectsManager /></section></main>;
}

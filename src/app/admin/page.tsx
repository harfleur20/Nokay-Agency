import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { LeadStatusControl } from "./lead-status";
import { LogoutButton } from "./logout-button";

export const metadata = { title: "Administration | NOKAY", robots: { index: false, follow: false } };

const serviceNames: Record<string, string> = { website: "Site vitrine", application: "Application web", saas: "SaaS", design: "Design & communication", other: "Autre" };
const budgetNames: Record<string, string> = { unknown: "À définir", lt3: "< 3 000 €", "3-7": "3–7 k€", "7-15": "7–15 k€", "15-30": "15–30 k€", gt15: "> 15 k€", gt30: "> 30 k€" };

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const [leads, total, newCount, wonCount] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "WON" } }),
  ]);
  return <main className="admin-page"><header className="admin-topbar"><a href="/" className="brand">NOKAY<span>.</span></a><div>{admin.role !== "PROJECT_MANAGER" && <><a href="/admin/services">Prestations ↗</a><a href="/admin/quotes">Devis ↗</a></>}<a href="/admin/projects">Projets ↗</a><span>{admin.name} · {admin.role}</span><LogoutButton /></div></header>
    <section className="admin-content"><p className="eyebrow">ESPACE DE GESTION / NOKAY</p><h1>Tableau de bord<span>.</span></h1><p className="admin-subtitle">Suivez les demandes entrantes et leur avancement.</p>
      <div className="admin-stats"><article><span>Total demandes</span><strong>{total}</strong></article><article><span>Nouvelles</span><strong>{newCount}</strong></article><article><span>Projets gagnés</span><strong>{wonCount}</strong></article></div>
      <div className="admin-table-heading"><h2>Demandes de devis</h2><span>{leads.length} dernières demandes</span></div>
      {leads.length === 0 ? <div className="admin-empty">Aucune demande pour le moment. Les prochains briefs apparaîtront ici.</div> : <div className="admin-leads">{leads.map((lead) => <article className="admin-lead" key={lead.id}><div className="admin-lead__main"><div><strong>{lead.name}</strong><a href={`mailto:${lead.email}`}>{lead.email}</a>{lead.company && <span>{lead.company}</span>}</div><time dateTime={lead.createdAt.toISOString()}>{lead.createdAt.toLocaleDateString("fr-FR")}</time></div><div className="admin-lead__meta"><span>{serviceNames[lead.service] || lead.service}</span><span>{budgetNames[lead.budget] || lead.budget}</span><LeadStatusControl id={lead.id} initialStatus={lead.status} /></div><details><summary>Lire le brief</summary><p>{lead.message}</p></details></article>)}</div>}
    </section>
  </main>;
}

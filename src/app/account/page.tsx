import Link from "next/link";
import { redirect } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/app/admin/logout-button";
import { PaymentButton } from "./payment-button";

const projectLabels: Record<string,string> = { PLANNING:"Planification", DESIGN:"Design", DEVELOPMENT:"Développement", REVIEW:"Validation", DELIVERED:"Livré", ON_HOLD:"En pause" };
const quoteLabels: Record<string,string> = { DRAFT:"En préparation", SENT:"Envoyé", ACCEPTED:"Accepté", REJECTED:"Refusé", EXPIRED:"Expiré" };

export const metadata = { title: "Mon espace | NOKAY", robots: { index:false, follow:false } };

export default async function AccountPage() {
  const client = await requireClient();
  if (!client) redirect("/account/login");
  const [projects,quotes,orders] = await Promise.all([
    prisma.project.findMany({ where:{clientId:client.id}, include:{updates:{where:{visibleToClient:true},orderBy:{createdAt:"desc"},take:10}}, orderBy:{updatedAt:"desc"} }),
    prisma.quote.findMany({ where:{clientId:client.id}, orderBy:{createdAt:"desc"} }),
    prisma.order.findMany({ where:{clientId:client.id}, include:{payments:true}, orderBy:{createdAt:"desc"} }),
  ]);
  return <main className="admin-page"><header className="admin-topbar"><Link href="/" className="brand">NOKAY<span>.</span></Link><div><span>Bonjour {client.name}</span><LogoutButton /></div></header><section className="admin-content"><p className="eyebrow">ESPACE CLIENT / NOKAY</p><h1>Votre espace<span>.</span></h1><p className="admin-subtitle">Retrouvez l'avancement de vos projets et vos documents commerciaux.</p>
    <div className="admin-table-heading"><h2>Mes projets</h2><span>{projects.length} projet(s)</span></div>
    {projects.length===0 ? <div className="admin-empty">Aucun projet n'est encore associé à votre espace.</div> : <div className="admin-leads">{projects.map(project=><article className="admin-lead" key={project.id}><div className="admin-lead__main"><strong>{project.name}</strong><span>{projectLabels[project.status] || project.status} · {project.progress}%</span></div><div className="client-progress"><span style={{width:`${project.progress}%`}} /></div>{project.description && <p className="project-description">{project.description}</p>}<div className="client-updates"><strong>Actualités du projet</strong>{project.updates.length===0 ? <p>Aucune actualité publiée.</p> : project.updates.map(update=><div key={update.id}><span>{update.createdAt.toLocaleDateString("fr-FR")}</span><strong>{update.title}</strong><p>{update.body}</p></div>)}</div></article>)}</div>}
    <div className="admin-table-heading client-section-heading"><h2>Mes devis</h2><span>{quotes.length} devis</span></div>
    {quotes.length===0 ? <div className="admin-empty">Aucun devis disponible.</div> : <div className="admin-leads">{quotes.map(quote=><article className="admin-lead" key={quote.id}><div className="admin-lead__main"><strong>{quote.reference} · {quote.title}</strong><span>{quoteLabels[quote.status] || quote.status}</span><strong>{(quote.amountCents/100).toLocaleString("fr-FR",{style:"currency",currency:quote.currency})} HT</strong></div>{quote.description && <p className="project-description">{quote.description}</p>}</article>)}</div>}
    <div className="admin-table-heading client-section-heading"><h2>Mes commandes et paiements</h2><span>{orders.length} commande(s)</span></div>
    {orders.length===0 ? <div className="admin-empty">Aucune commande enregistrée.</div> : <div className="admin-leads">{orders.map(order=>{const paid=order.payments.filter(payment=>payment.status==="SUCCEEDED").reduce((sum,payment)=>sum+payment.amountCents,0);const remaining=Math.max(0,order.amountCents-paid);return <article className="admin-lead" key={order.id}><div className="admin-lead__main"><strong>{order.reference} · {order.title}</strong><strong>{(order.amountCents/100).toLocaleString("fr-FR",{style:"currency",currency:order.currency})}</strong></div><p className="project-description">{order.payments.length} paiement(s) enregistré(s) · {order.status} · Reste à payer : {(remaining/100).toLocaleString("fr-FR",{style:"currency",currency:order.currency})}</p>{remaining>0 && order.status!=="CANCELLED" && order.status!=="COMPLETED" && <PaymentButton orderId={order.id} />}</article>})}</div>}
  </section></main>;
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/permissions";
import { PortfolioManager } from "./portfolio-manager";

export const metadata={title:"Portfolio | Administration NOKAY",robots:{index:false,follow:false}};
export default async function AdminPortfolioPage(){const admin=await requireRoles(["SUPER_ADMIN","ADMIN"]);if(!admin)redirect("/admin");return <main className="admin-page"><header className="admin-topbar"><Link href="/" className="brand">NOKAY<span>.</span></Link><div><Link href="/admin">← Tableau de bord</Link><span>{admin.name}</span></div></header><section className="admin-content"><p className="eyebrow">CONTENU / NOKAY</p><h1>Portfolio<span>.</span></h1><p className="admin-subtitle">Publiez vos projets et distinguez clairement les concepts des références réelles.</p><PortfolioManager /></section></main>;}

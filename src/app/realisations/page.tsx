import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Réalisations — Projets clients",
  description: "Découvrez une sélection de projets réalisés par Osez. pour ses clients.",
  alternates: { canonical: "/realisations" },
};

export default async function RealisationsPage() {
  let items: Awaited<ReturnType<typeof prisma.portfolioItem.findMany>> = [];
  try {
    items = await prisma.portfolioItem.findMany({
      where: { published: true, isConcept: false },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) { console.error("Osez client portfolio could not be loaded", error); }

  return <main id="top" className="portfolio-page">
    <SiteHeader homeHref="/" />
    <section className="portfolio-hero section-shell">
      <p className="eyebrow">Notre travail · Projets clients</p>
      <h1>Des idées<br /><span>devenues réelles.</span></h1>
      <p>Découvrez les projets que nos clients nous ont confiés, imaginés et construits ensemble.</p>
    </section>
    <section className="portfolio-list section-shell">
      {items.length ? <div className="project-grid">{items.map((item, index) => <Reveal key={item.id}>
        <article className="project-card project-card--lime">
          <div className="project-card__visual" style={item.imageUrl ? { backgroundImage: `linear-gradient(rgba(16,17,20,.16),rgba(16,17,20,.48)),url("${item.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
            <span className="project-card__mark">{item.title.slice(0, 1).toUpperCase()}.</span>
            <span className="project-card__view"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span>Consulter</span></span>
          </div>
          <div className="project-card__meta"><span>{item.category}</span><span>Projet client</span></div>
          <h2>{item.title}</h2><p>{item.summary}</p>
          {item.projectUrl ? <a className="portfolio-project-link" href={item.projectUrl} target="_blank" rel="noreferrer">Consulter le projet ↗</a> : <span className="portfolio-project-link">Présentation sur demande</span>}
        </article>
      </Reveal>)}</div> : <p className="portfolio-empty">Nos projets clients seront présentés ici prochainement. Revenez découvrir nos prochaines collaborations.</p>}
    </section>
    <footer className="site-footer"><div className="section-shell">
      <div className="site-footer__top"><a href="/" className="brand brand--footer">Osez<span>.</span></a><p>Ideas into digital experiences.</p><a className="footer-contact" href="/#contact">Parlons de votre projet ↗</a></div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} Osez. Tous droits réservés.</span><span>Créativité · Technologie · Expérience</span><a href="#top">Retour en haut ↑</a></div>
    </div></footer>
  </main>;
}

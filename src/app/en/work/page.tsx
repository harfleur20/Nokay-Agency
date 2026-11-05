import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Selected work — Client projects",
  description: "Explore a selection of projects delivered by Osez. for its clients.",
  alternates: { canonical: "/en/work" },
};

export default async function WorkPage() {
  let items: Awaited<ReturnType<typeof prisma.portfolioItem.findMany>> = [];
  try {
    items = await prisma.portfolioItem.findMany({
      where: { published: true, isConcept: false },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) { console.error("Osez client portfolio could not be loaded", error); }

  return <main id="top" className="portfolio-page" lang="en">
    <SiteHeader locale="en" homeHref="/en" />
    <section className="portfolio-hero section-shell">
      <p className="eyebrow">Our work · Client projects</p>
      <h1>Ideas<br /><span>made real.</span></h1>
      <p>Explore projects entrusted to us by our clients and brought to life together.</p>
    </section>
    <section className="portfolio-list section-shell">
      {items.length ? <div className="project-grid">{items.map((item) => <Reveal key={item.id}>
        <article className="project-card project-card--lime">
          <div className="project-card__visual" style={item.imageUrl ? { backgroundImage: `linear-gradient(rgba(16,17,20,.16),rgba(16,17,20,.48)),url("${item.imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
            <span className="project-card__mark">{item.title.slice(0, 1).toUpperCase()}.</span>
            <span className="project-card__view"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span>View project</span></span>
          </div>
          <div className="project-card__meta"><span>{item.category}</span><span>Client project</span></div>
          <h2>{item.title}</h2><p>{item.summary}</p>
          {item.projectUrl ? <a className="portfolio-project-link" href={item.projectUrl} target="_blank" rel="noreferrer">View project ↗</a> : <span className="portfolio-project-link">Details on request</span>}
        </article>
      </Reveal>)}</div> : <p className="portfolio-empty">Our client projects will be featured here soon. Come back to discover our upcoming collaborations.</p>}
    </section>
    <footer className="site-footer"><div className="section-shell">
      <div className="site-footer__top"><a href="/en" className="brand brand--footer">Osez<span>.</span></a><p>Ideas into digital experiences.</p><a className="footer-contact" href="/en#contact">Let’s talk about your project ↗</a></div>
      <div className="site-footer__bottom"><span>© {new Date().getFullYear()} Osez. All rights reserved.</span><span>Creativity · Technology · Experience</span><a href="#top">Back to top ↑</a></div>
    </div></footer>
  </main>;
}

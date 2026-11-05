import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";

type ExpertiseContent = {
  title: string; eyebrow: string; intro: string; description: string;
  outcomes: readonly string[]; deliverables: readonly string[]; process: string; cta: string;
};

export function ExpertisePage({ content, locale, otherServices }: {
  content: ExpertiseContent; locale: "fr" | "en";
  otherServices: readonly { href: string; label: string }[];
}) {
  const en = locale === "en";
  return (
    <main id="top">
      <SiteHeader locale={locale} homeHref={locale === "en" ? "/en" : "/"} />
      <section className="detail-hero section-shell">
        <Reveal><p className="eyebrow"><span className="eyebrow__line" /> {content.eyebrow}</p></Reveal>
        <Reveal delay={0.08}><h1>{content.title}<span>.</span></h1></Reveal>
        <Reveal delay={0.16}><p className="detail-hero__intro">{content.intro}</p></Reveal>
        <div className="detail-hero__bottom"><span>{en ? "NOKAY / EXPERTISE" : "NOKAY / EXPERTISE"}</span><Link href={en ? "/en#expertises" : "/#expertises"}>{en ? "All expertise" : "Toutes nos expertises"} ↗</Link></div>
      </section>
      <section className="detail-overview"><div className="section-shell detail-overview__grid"><Reveal><p className="eyebrow"><span className="eyebrow__line" /> {en ? "Our approach" : "Notre approche"}</p><h2>{en ? "Purposeful digital, built around you." : "Du digital utile, pensé autour de vous."}</h2></Reveal><Reveal delay={0.1}><p>{content.description}</p></Reveal></div></section>
      <section className="section section-shell detail-columns">
        <Reveal><div><p className="eyebrow"><span className="eyebrow__line" /> {en ? "What you gain" : "Ce que vous obtenez"}</p><h2>{en ? "Designed for<br />real outcomes." : "Pensé pour<br />des résultats."}</h2><ul className="detail-list">{content.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></div></Reveal>
        <Reveal delay={0.1}><div><p className="eyebrow"><span className="eyebrow__line" /> {en ? "What we deliver" : "Nos livrables"}</p><h2>{en ? "From first idea<br />to delivery." : "De la première idée<br />à la livraison."}</h2><ul className="detail-list">{content.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div></Reveal>
      </section>
      <section className="detail-process"><div className="section-shell detail-process__grid"><div><p className="eyebrow"><span className="eyebrow__line" /> {en ? "Our process" : "Notre processus"}</p><h2>{en ? "A clear path.<br />No guesswork." : "Un parcours clair.<br />Sans improvisation."}</h2></div><p>{content.process}</p></div></section>
      <section className="detail-more section-shell"><p className="eyebrow"><span className="eyebrow__line" /> {en ? "Explore more" : "Explorer aussi"}</p><div>{otherServices.map((service) => <Link key={service.href} href={service.href}>{service.label}<span>↗</span></Link>)}</div></section>
      <section className="manifesto"><div className="section-shell manifesto__inner"><p className="eyebrow"><span className="eyebrow__line" /> {en ? "Have a project in mind?" : "Vous avez un projet en tête ?"}</p><h2>{en ? "Let's make<br />it <span>happen.</span>" : "Donnons vie<br />à votre <span>idée.</span>"}</h2><Link href={en ? "/en#contact" : "/#contact"} className="manifesto__link">{content.cta} <span>↗</span></Link></div></section>
      <footer className="site-footer"><div className="section-shell"><div className="site-footer__top"><Link href={en ? "/en" : "/"} className="brand brand--footer">NOKAY<span>.</span></Link><p>Ideas into digital experiences.</p><Link className="footer-contact" href={en ? "/en#contact" : "/#contact"}>{en ? "Contact us ↗" : "Nous contacter ↗"}</Link></div><div className="site-footer__bottom"><span>© {new Date().getFullYear()} NOKAY.</span><span>{en ? "Creativity · Technology · Experience" : "Créativité · Technologie · Expérience"}</span><Link href={en ? "/en" : "/"}>{en ? "Back to home ↑" : "Retour à l’accueil ↑"}</Link></div></div></footer>
    </main>
  );
}

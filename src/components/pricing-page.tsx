import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import { pricing, type Locale } from "@/lib/pricing";

export function PricingPage({ locale }: { locale: Locale }) {
  const t = pricing[locale];
  const en = locale === "en";
  return <main id="top" lang={locale}>
    <SiteHeader locale={locale} homeHref={en ? "/en" : "/"} />
    <section className="pricing-hero section-shell">
      <Reveal><p className="eyebrow"><span className="eyebrow__line" /> {t.eyebrow}</p></Reveal>
      <Reveal delay={0.08}><h1 dangerouslySetInnerHTML={{ __html: t.title }} /></Reveal>
      <Reveal delay={0.16}><p className="pricing-hero__intro">{t.intro}</p></Reveal>
      <p className="pricing-note">{t.note}</p>
    </section>
    <div className="pricing-categories">
      {t.categories.map((category, index) => <section id={category.id} className="pricing-category section-shell" key={category.id}>
        <Reveal><div className="pricing-category__heading"><div><p className="eyebrow"><span className="eyebrow__line" /> {String(index + 1).padStart(2, "0")} / OSEZ SERVICES</p><h2>{category.title}<span>.</span></h2></div><p>{category.intro}</p></div></Reveal>
        <div className="pricing-grid">
          {category.packages.map((item) => <Reveal key={item.name}><article className={`price-card ${item.featured ? "price-card--featured" : ""}`}>
            {item.featured && <span className="price-card__flag">{en ? "Most requested" : "Le plus choisi"}</span>}
            <p className="price-card__name">{item.name}</p><p className="price-card__description">{item.description}</p>
            <div className="price-card__price">{item.price}<span>{item.suffix}</span></div>
            <p className="price-card__included">{t.included}</p>
            <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <div className="price-card__timeline"><span>{t.timeline}</span><strong>{item.timeline}</strong></div>
            <Link className="price-card__cta" href={`${en ? "/en/quote" : "/devis"}?service=${category.id}&package=${encodeURIComponent(item.name)}`}>{t.packageCta}</Link>
          </article></Reveal>)}
        </div>
      </section>)}
    </div>
    <section className="pricing-custom"><div className="section-shell pricing-custom__inner"><div><p className="eyebrow"><span className="eyebrow__line" /> {en ? "Bespoke projects" : "Projets sur mesure"}</p><h2>{t.extrasTitle}</h2><p>{t.extrasText}</p></div><Link className="pricing-custom__cta" href={en ? "/en/quote" : "/devis"}>{t.cta} <span>⟶</span></Link></div></section>
    <section className="pricing-disclaimer section-shell"><p>{t.footerNote}</p><Link href={en ? "/en#contact" : "/#contact"}>{en ? "A quick question? Contact us" : "Une question ? Contactez-nous"} ⟶</Link></section>
    <footer className="site-footer"><div className="section-shell"><div className="site-footer__top"><Link href={en ? "/en" : "/"} className="brand brand--footer">Osez<span>.</span></Link><p>Ideas into digital experiences.</p><Link className="footer-contact" href={en ? "/en/quote" : "/devis"}>{en ? "Start a project ⟶" : "Démarrer un projet ⟶"}</Link></div><div className="site-footer__bottom"><span>© {new Date().getFullYear()} Osez.</span><span>{en ? "Creativity · Technology · Experience" : "Créativité · Technologie · Expérience"}</span><Link href={en ? "/en" : "/"}>{en ? "Back to home ↑" : "Retour à l’accueil ↑"}</Link></div></div></footer>
  </main>;
}

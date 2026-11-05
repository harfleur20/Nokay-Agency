import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { QuoteForm } from "@/components/quote-form";

export function QuotePage({ locale, service = "", packageName = "" }: { locale: "fr" | "en"; service?: string; packageName?: string }) {
  const en = locale === "en";
  return <main id="top" lang={locale}>
    <SiteHeader locale={locale} homeHref={en ? "/en" : "/"} />
    <section className="quote-hero section-shell">
      <p className="eyebrow"><span className="eyebrow__line" /> {en ? "Project enquiry / NOKAY" : "Demande de projet / NOKAY"}</p>
      <h1>{en ? <>Let's make<br /><span>it happen.</span></> : <>Donnons vie<br /><span>à votre idée.</span></>}</h1>
      <p>{en ? "Share the essentials. We'll review your needs and get back to you with the next steps." : "Présentez-nous les grandes lignes. Nous étudierons votre besoin et reviendrons vers vous pour définir la suite."}</p>
    </section>
    <section className="contact-section quote-section"><div className="section-shell contact-layout">
      <div className="contact-intro"><p className="eyebrow"><span className="eyebrow__line" /> {en ? "Your brief" : "Votre brief"}</p><h2>{en ? "A clear start for a strong project." : "Un bon départ pour un projet solide."}</h2><p>{en ? "This form is an initial enquiry, not a binding order. Scope, price and timeline will be confirmed in a written proposal." : "Ce formulaire constitue une première demande, pas une commande ferme. Le périmètre, le prix et le calendrier seront confirmés dans une proposition écrite."}</p><Link className="quote-back" href={en ? "/en/pricing" : "/tarifs"}>← {en ? "Back to pricing" : "Retour aux tarifs"}</Link></div>
      <QuoteForm locale={locale} initialService={service} initialPackage={packageName} />
    </div></section>
    <footer className="site-footer"><div className="section-shell"><div className="site-footer__top"><Link href={en ? "/en" : "/"} className="brand brand--footer">NOKAY<span>.</span></Link><p>Ideas into digital experiences.</p><Link className="footer-contact" href={en ? "/en/pricing" : "/tarifs"}>{en ? "View pricing ↗" : "Voir les tarifs ↗"}</Link></div><div className="site-footer__bottom"><span>© {new Date().getFullYear()} NOKAY.</span><span>{en ? "Creativity · Technology · Experience" : "Créativité · Technologie · Expérience"}</span><Link href={en ? "/en" : "/"}>{en ? "Back to home ↑" : "Retour à l’accueil ↑"}</Link></div></div></footer>
  </main>;
}

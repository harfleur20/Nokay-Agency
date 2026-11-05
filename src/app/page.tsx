import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";

const services = [
  { number: "01", title: "Sites vitrines", tag: "Visibilité & conversion", description: "Des sites singuliers qui racontent votre histoire, valorisent votre expertise et transforment l’attention en opportunités." },
  { number: "02", title: "Applications web", tag: "Outils & expériences", description: "Des plateformes et outils métier pensés autour de vos utilisateurs, de vos processus et de vos objectifs." },
  { number: "03", title: "Produits SaaS", tag: "Du produit à l’échelle", description: "Nous concevons des expériences logicielles utiles, intuitives et capables d’évoluer avec votre activité." },
  { number: "04", title: "Design & communication", tag: "Identité & expression", description: "Identité visuelle, UI/UX, design graphique et motion design pour donner une personnalité cohérente à vos idées." },
];

const concepts = [
  { number: "01", type: "Concept e-commerce", title: "MONOCHROME", description: "Une direction artistique éditoriale pour une marque lifestyle.", tone: "project-card--lime", mark: "M." },
  { number: "02", type: "Concept SaaS", title: "NEXORA", description: "Un tableau de bord produit centré sur la clarté des données.", tone: "project-card--violet", mark: "N/" },
  { number: "03", type: "Concept identité", title: "FORME STUDIO", description: "Un univers graphique modulaire pour une marque créative.", tone: "project-card--orange", mark: "F." },
];

const steps = [
  ["01", "Découverte", "Nous échangeons sur votre activité, vos utilisateurs, vos enjeux et vos objectifs."],
  ["02", "Stratégie & conception", "Nous cadrons le besoin, définissons le périmètre et dessinons la solution."],
  ["03", "Design & prototypage", "Nous donnons forme à l’expérience avec des interfaces et prototypes à valider."],
  ["04", "Développement", "Nous construisons le produit avec une attention particulière à la qualité et aux performances."],
  ["05", "Tests & validation", "Nous vérifions les parcours, les contenus, l’affichage et les fonctionnalités."],
  ["06", "Livraison & accompagnement", "Nous préparons la mise en ligne et vous accompagnons dans la prise en main."],
];

export default function Home() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="hero section-shell">
        <div className="hero__orb hero__orb--one" aria-hidden="true" />
        <div className="hero__orb hero__orb--two" aria-hidden="true" />
        <div className="hero__content">
          <Reveal><p className="eyebrow"><span className="eyebrow__line" /> Agence digitale créative & technologique</p></Reveal>
          <Reveal delay={0.08}><h1>Ideas into<br /><span>digital</span> experiences<span className="hero__period">.</span></h1></Reveal>
          <Reveal delay={0.16}>
            <div className="hero__bottom">
              <p>Nous transformons les idées ambitieuses en expériences digitales utiles, désirables et mémorables.</p>
              <a className="round-link" href="#expertises" aria-label="Découvrir nos expertises">↓</a>
            </div>
          </Reveal>
        </div>
        <div className="hero__index" aria-hidden="true"><span>01 / 04</span><span>SCROLL TO EXPLORE</span></div>
      </section>

      <section className="intro-band"><div className="section-shell intro-band__inner"><p>La créativité ouvre la voie.<br /><span>La technologie lui donne vie.</span></p><span className="intro-band__asterisk" aria-hidden="true">✳</span></div></section>

      <section id="expertises" className="section section-shell">
        <Reveal><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow__line" /> Nos expertises</p><h2>Des idées.<br /><span>Du concret.</span></h2></div><p className="section-heading__aside">Nous réunissons stratégie, design et développement pour créer des solutions digitales qui servent vos ambitions.</p></div></Reveal>
        <div className="service-list">{services.map((service) => <Reveal key={service.number}><Link href={["/expertises/sites-vitrines","/expertises/applications-web","/expertises/saas","/expertises/design-communication"][Number(service.number)-1]} className="service-row"><span className="service-row__number">{service.number}</span><div className="service-row__main"><h3>{service.title}</h3><p>{service.description}</p></div><span className="service-row__tag">{service.tag}</span><span className="service-row__arrow" aria-hidden="true">↗</span></Link></Reveal>)}</div>
      </section>

      <section id="realisations" className="section projects-section"><div className="section-shell">
        <Reveal><div className="section-heading section-heading--light"><div><p className="eyebrow"><span className="eyebrow__line" /> Sélection créative</p><h2>Explorer<br /><span>les possibles.</span></h2></div><p className="section-heading__aside">Quelques directions créatives illustrant notre approche. Ces visuels sont des concepts de démonstration, pas des références clients.</p></div></Reveal>
        <div className="project-grid">{concepts.map((project) => <Reveal key={project.number}><article className={`project-card ${project.tone}`}><div className="project-card__visual"><span className="project-card__mark">{project.mark}</span><span className="project-card__index">{project.number}</span><span className="project-card__orbit" /></div><div className="project-card__meta"><span>{project.type}</span><span>Concept créatif</span></div><h3>{project.title}</h3><p>{project.description}</p></article></Reveal>)}</div>
      </div></section>

      <section className="trust-section section-shell"><Reveal><div className="trust-section__copy"><p className="eyebrow"><span className="eyebrow__line" /> La confiance, avant tout</p><h2>Les belles collaborations commencent par <span>une rencontre.</span></h2></div><div className="trust-section__note"><span className="trust-section__symbol">✳</span><p>Nous présenterons ici nos clients et partenaires avec leur accord. Chaque collaboration mérite d’être racontée avec justesse.</p></div></Reveal></section>

      <section id="processus" className="section process-section"><div className="section-shell">
        <Reveal><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow__line" /> Notre processus</p><h2>De l’idée<br /><span>à l’impact.</span></h2></div><p className="section-heading__aside">Un cadre clair, des échanges réguliers et une progression visible à chaque étape.</p></div></Reveal>
        <div className="process-grid">{steps.map(([number, title, description]) => <Reveal key={number}><article className="process-card"><span>{number}</span><h3>{title}</h3><p>{description}</p></article></Reveal>)}</div>
      </div></section>

      <section className="manifesto"><div className="section-shell manifesto__inner"><p className="eyebrow"><span className="eyebrow__line" /> Et si on construisait la suite ?</p><h2>Votre prochaine<br />idée mérite <span>mieux.</span></h2><a href="#contact" className="manifesto__link">Parlons de votre projet <span>↗</span></a></div></section>

      <ContactForm locale="fr" />
      <footer className="site-footer"><div className="section-shell">
        <div className="site-footer__top"><a href="#top" className="brand brand--footer">NOKAY<span>.</span></a><p>Ideas into digital experiences.</p><a className="footer-contact" href="#expertises">Découvrir nos expertises ↗</a></div>
        <div className="site-footer__bottom"><span>© {new Date().getFullYear()} NOKAY. Tous droits réservés.</span><span>Créativité · Technologie · Expérience</span><a href="#top">Retour en haut ↑</a></div>
      </div></footer>
    </main>
  );
}

import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Reveal } from "@/components/reveal";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Digital agency for web, software & brand experiences",
  description: "NOKAY designs and builds websites, web applications, SaaS products and visual identities.",
  alternates: { canonical: "/en" },
};

const services = [
  { number: "01", title: "Websites", tag: "Visibility & conversion", description: "Distinctive websites that tell your story, showcase your expertise and turn attention into opportunity." },
  { number: "02", title: "Web applications", tag: "Tools & experiences", description: "Digital platforms and business tools designed around your users, workflows and goals." },
  { number: "03", title: "SaaS products", tag: "From product to scale", description: "Useful, intuitive software experiences built to evolve with your business." },
  { number: "04", title: "Design & communication", tag: "Identity & expression", description: "Visual identity, UI/UX, graphic design and motion design that give your ideas a coherent voice." },
];

const concepts = [
  { number: "01", type: "E-commerce concept", title: "MONOCHROME", description: "An editorial art direction for a lifestyle brand.", tone: "project-card--lime", mark: "M." },
  { number: "02", type: "SaaS concept", title: "NEXORA", description: "A product dashboard focused on data clarity.", tone: "project-card--violet", mark: "N/" },
  { number: "03", type: "Brand concept", title: "FORME STUDIO", description: "A modular visual universe for a creative brand.", tone: "project-card--orange", mark: "F." },
];

const steps = [
  ["01", "Discovery", "We learn about your business, users, challenges and ambitions."],
  ["02", "Strategy & planning", "We define the scope, align priorities and shape the right solution."],
  ["03", "Design & prototyping", "We bring the experience to life through interfaces and prototypes."],
  ["04", "Development", "We build your product with care for quality, accessibility and performance."],
  ["05", "Testing & validation", "We test user journeys, content, responsive layouts and features."],
  ["06", "Delivery & support", "We prepare the launch and help you take ownership of your solution."],
];

export default function EnglishHome() {
  return (
    <main id="top">
      <SiteHeader locale="en" />
      <section className="hero section-shell">
        <div className="hero__orb hero__orb--one" aria-hidden="true" />
        <div className="hero__orb hero__orb--two" aria-hidden="true" />
        <div className="hero__content">
          <Reveal><p className="eyebrow"><span className="eyebrow__line" /> Creative & technology digital agency</p></Reveal>
          <Reveal delay={0.08}><h1>Ideas into<br /><span>digital</span> experiences<span className="hero__period">.</span></h1></Reveal>
          <Reveal delay={0.16}><div className="hero__bottom"><p>We turn ambitious ideas into digital experiences that are useful, desirable and memorable.</p><a className="round-link" href="#expertises" aria-label="Explore our expertise">↓</a></div></Reveal>
        </div>
        <div className="hero__index" aria-hidden="true"><span>01 / 04</span><span>SCROLL TO EXPLORE</span></div>
      </section>

      <section className="intro-band"><div className="section-shell intro-band__inner"><p>Creativity opens the way.<br /><span>Technology brings it to life.</span></p><span className="intro-band__asterisk" aria-hidden="true">✳</span></div></section>

      <section id="expertises" className="section section-shell">
        <Reveal><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow__line" /> What we do</p><h2>Big ideas.<br /><span>Made real.</span></h2></div><p className="section-heading__aside">We bring strategy, design and development together to create digital solutions that move your business forward.</p></div></Reveal>
        <div className="service-list">{services.map((service) => <Reveal key={service.number}><Link href={["/en/expertise/websites","/en/expertise/web-applications","/en/expertise/saas","/en/expertise/design-communication"][Number(service.number)-1]} className="service-row"><span className="service-row__number">{service.number}</span><div className="service-row__main"><h3>{service.title}</h3><p>{service.description}</p></div><span className="service-row__tag">{service.tag}</span><span className="service-row__arrow" aria-hidden="true">↗</span></Link></Reveal>)}</div>
      </section>

      <section id="realisations" className="section projects-section"><div className="section-shell">
        <Reveal><div className="section-heading section-heading--light"><div><p className="eyebrow"><span className="eyebrow__line" /> Selected work</p><h2>Explore<br /><span>the possible.</span></h2></div><p className="section-heading__aside">A few creative directions that illustrate our approach. These are demonstration concepts, not client case studies.</p></div></Reveal>
        <div className="project-grid">{concepts.map((project) => <Reveal key={project.number}><article className={`project-card ${project.tone}`}><div className="project-card__visual"><span className="project-card__mark">{project.mark}</span><span className="project-card__index">{project.number}</span><span className="project-card__orbit" /></div><div className="project-card__meta"><span>{project.type}</span><span>Creative concept</span></div><h3>{project.title}</h3><p>{project.description}</p></article></Reveal>)}</div>
      </div></section>

      <section className="trust-section section-shell"><Reveal><div className="trust-section__copy"><p className="eyebrow"><span className="eyebrow__line" /> Built on trust</p><h2>Great collaborations start with <span>a conversation.</span></h2></div><div className="trust-section__note"><span className="trust-section__symbol">✳</span><p>We will feature clients and partners here with their permission. Every collaboration deserves to be represented with honesty.</p></div></Reveal></section>

      <section id="processus" className="section process-section"><div className="section-shell">
        <Reveal><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow__line" /> How we work</p><h2>From idea<br /><span>to impact.</span></h2></div><p className="section-heading__aside">A clear framework, regular conversations and visible progress at every stage.</p></div></Reveal>
        <div className="process-grid">{steps.map(([number, title, description]) => <Reveal key={number}><article className="process-card"><span>{number}</span><h3>{title}</h3><p>{description}</p></article></Reveal>)}</div>
      </div></section>

      <section className="manifesto"><div className="section-shell manifesto__inner"><p className="eyebrow"><span className="eyebrow__line" /> Ready to build what's next?</p><h2>Your next idea<br />deserves <span>better.</span></h2><a href="#contact" className="manifesto__link">Let's talk about your project <span>↗</span></a></div></section>

      <ContactForm locale="en" />
      <footer className="site-footer"><div className="section-shell">
        <div className="site-footer__top"><a href="#top" className="brand brand--footer">NOKAY<span>.</span></a><p>Ideas into digital experiences.</p><a className="footer-contact" href="/#contact">Start a conversation ↗</a></div>
        <div className="site-footer__bottom"><span>© {new Date().getFullYear()} NOKAY. All rights reserved.</span><span>Creativity · Technology · Experience</span><a href="#top">Back to top ↑</a></div>
      </div></footer>
    </main>
  );
}

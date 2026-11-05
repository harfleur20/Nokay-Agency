"use client";

import { useEffect, useRef, useState } from "react";

type SiteHeaderProps = { locale?: "fr" | "en"; homeHref?: string };
type Service = { title: string; description: string; icon: "mark" | "palette" | "users" | "layout" | "monitor" | "code" | "layers" | "cloud" | "search" | "spark" | "target" | "chart" | "megaphone" };
type Expertise = { id: string; title: string; description: string; services: Service[] };

const expertiseContent: Record<"fr" | "en", Expertise[]> = {
  fr: [
    { id: "design", title: "Design", description: "Une identité forte, une expérience fidèle à votre image.", services: [
      { title: "Conception de logo", description: "Travailler une image fidèle et unique", icon: "mark" },
      { title: "Charte graphique", description: "Concevoir une identité visuelle adaptée", icon: "palette" },
      { title: "Ateliers persona", description: "Mieux comprendre vos publics et leurs usages", icon: "users" },
      { title: "Audit UI/UX", description: "Challenger l'ergonomie et l'esthétique", icon: "layout" },
      { title: "Maquette de site", description: "Créer arborescences, wireframes et maquettes", icon: "monitor" },
    ]},
    { id: "developpement", title: "Développement", description: "Des produits digitaux conçus pour prendre vie et évoluer.", services: [
      { title: "Site vitrine", description: "Présenter votre activité avec impact", icon: "monitor" },
      { title: "Application web", description: "Créer des outils adaptés à vos usages", icon: "code" },
      { title: "Développement sur mesure", description: "Construire les fonctionnalités de votre projet", icon: "layers" },
      { title: "SaaS", description: "Transformer votre idée en produit évolutif", icon: "cloud" },
    ]},
    { id: "seo-geo", title: "SEO / GEO", description: "Améliorer votre visibilité sur les moteurs de recherche et les IA.", services: [
      { title: "Référencement naturel", description: "Développer votre visibilité sur Google", icon: "search" },
      { title: "Optimisation GEO", description: "Préparer votre présence dans les réponses des IA", icon: "spark" },
      { title: "Audit & stratégie", description: "Identifier les leviers de progression", icon: "chart" },
    ]},
    { id: "ads", title: "ADS", description: "Attirer les bonnes audiences et développer votre acquisition.", services: [
      { title: "Publicité en ligne", description: "Lancer des campagnes ciblées", icon: "megaphone" },
      { title: "Stratégie d'acquisition", description: "Toucher les audiences qui comptent", icon: "target" },
      { title: "Suivi des performances", description: "Mesurer et optimiser vos campagnes", icon: "chart" },
    ]},
  ],
  en: [
    { id: "design", title: "Design", description: "A distinctive identity and an experience that feels like you.", services: [
      { title: "Logo design", description: "Build a distinctive and authentic image", icon: "mark" },
      { title: "Visual identity", description: "Create a visual system made for your brand", icon: "palette" },
      { title: "Persona workshops", description: "Understand your audiences and their needs", icon: "users" },
      { title: "UI/UX audit", description: "Challenge usability and visual design", icon: "layout" },
      { title: "Website mockups", description: "Create sitemaps, wireframes and mockups", icon: "monitor" },
    ]},
    { id: "development", title: "Development", description: "Digital products built to launch, grow and evolve.", services: [
      { title: "Showcase website", description: "Present your business with impact", icon: "monitor" },
      { title: "Web application", description: "Build tools tailored to your workflows", icon: "code" },
      { title: "Custom development", description: "Create the features your project needs", icon: "layers" },
      { title: "SaaS", description: "Turn your idea into a scalable product", icon: "cloud" },
    ]},
    { id: "seo-geo", title: "SEO / GEO", description: "Grow your visibility across search engines and AI.", services: [
      { title: "Organic search", description: "Improve your visibility on Google", icon: "search" },
      { title: "GEO optimisation", description: "Build your presence in AI-generated answers", icon: "spark" },
      { title: "Audit & strategy", description: "Find the right opportunities to grow", icon: "chart" },
    ]},
    { id: "ads", title: "ADS", description: "Reach the right audiences and grow acquisition.", services: [
      { title: "Online advertising", description: "Launch targeted advertising campaigns", icon: "megaphone" },
      { title: "Acquisition strategy", description: "Reach the audiences that matter", icon: "target" },
      { title: "Performance tracking", description: "Measure and optimise your campaigns", icon: "chart" },
    ]},
  ],
};

const navigation = {
  fr: [
    { href: "/realisations", label: "Réalisations" },
    { href: "#processus", label: "Notre méthode" },
    { href: "/tarifs", label: "Tarifs" },
    { href: "#contact", label: "Contact" },
  ],
  en: [
    { href: "/en/work", label: "Selected work" },
    { href: "#processus", label: "Our process" },
    { href: "/en/pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ],
};

function ServiceIcon({ kind }: { kind: Service["icon"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<Service["icon"], React.ReactNode> = {
    mark: <><path d="M12 3.5 14.4 9.6 21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3.5Z"/><circle cx="12" cy="12" r="2.2"/></>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.1a2 2 0 0 0 1.4-3.4 1.7 1.7 0 0 1 1.2-2.9H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7.5" r=".8"/><circle cx="15" cy="7.8" r=".8"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3.5 20v-1.4A5.5 5.5 0 0 1 9 13h.5a5.5 5.5 0 0 1 5.5 5.5V20"/><path d="M16 5.3a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8V20"/></>,
    layout: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></>,
    monitor: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
    code: <><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    cloud: <><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 9.5 4.2 4.2 0 0 0 7 18Z"/><path d="m9 14 3-3 3 3"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    spark: <><path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    chart: <><path d="M4 19V5m0 14h17"/><path d="m7 15 4-4 3 2 6-7"/></>,
    megaphone: <><path d="m3 11 17-6v14L3 13v-2Z"/><path d="m7 14 2 6h4l-2-5M20 10h2m-2 4h2"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{paths[kind]}</svg>;
}

export function SiteHeader({ locale = "fr", homeHref = "" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("design");
  const menuRef = useRef<HTMLDivElement>(null);
  const links = navigation[locale];
  const categories = expertiseContent[locale];
  const active = categories.find((item) => item.id === activeCategory) ?? categories[0];
  const isEnglish = locale === "en";
  const sectionHref = (href: string) => href.startsWith("#") && homeHref ? `${homeHref}${href}` : href;
  const closeMenus = () => { setOpen(false); setMobileOpen(false); };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href={isEnglish ? "/en" : "/"} className="brand" aria-label="Osez, accueil">Osez<span>.</span></a>
        <nav className="desktop-nav" aria-label={isEnglish ? "Main navigation" : "Navigation principale"}>
          <div className="expertise-nav" ref={menuRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button type="button" className={`expertise-nav__trigger ${open ? "is-active" : ""}`} aria-expanded={open} aria-controls="expertise-mega-menu" onClick={() => setOpen((value) => !value)}>
              {isEnglish ? "Expertise" : "Expertises"}<span className="expertise-nav__chevron" aria-hidden="true">⌄</span>
            </button>
            <div id="expertise-mega-menu" className={`expertise-mega ${open ? "is-open" : ""}`} aria-hidden={!open}>
              <div className="expertise-mega__categories" role="tablist" aria-label={isEnglish ? "Expertise categories" : "Catégories d'expertise"}>
                {categories.map((category) => (
                  <button key={category.id} type="button" role="tab" aria-selected={active.id === category.id} className={`expertise-mega__category ${active.id === category.id ? "is-active" : ""}`} onMouseEnter={() => setActiveCategory(category.id)} onFocus={() => setActiveCategory(category.id)} onClick={() => setActiveCategory(category.id)}>
                    <span className="expertise-mega__category-copy"><strong>{category.title}</strong><small>{category.description}</small></span>
                    <span className="expertise-mega__category-arrow" aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
              <div className="expertise-mega__details" role="tabpanel">
                <div className="expertise-mega__services">
                  {active.services.map((service, index) => (
                    <a key={service.title} className="expertise-mega__service" href={sectionHref("#expertises")} onClick={closeMenus} style={{ "--service-index": index } as React.CSSProperties}>
                      <span className="expertise-mega__service-icon"><ServiceIcon kind={service.icon}/></span>
                      <span className="expertise-mega__service-copy"><strong>{service.title}</strong><small>{service.description}</small></span>
                      <span className="expertise-mega__service-arrow" aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
                <a className="expertise-mega__footer" href={sectionHref("#expertises")} onClick={closeMenus}>
                  {isEnglish ? <>Discover our <strong>{active.title}</strong> expertise</> : <>Découvrez notre expertise <strong>{active.title}</strong></>}
                  <span aria-hidden="true">⟶</span>
                </a>
              </div>
            </div>
          </div>
          {links.map((link) => <a key={link.href} href={sectionHref(link.href)}>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="language-switch" href={isEnglish ? "/" : "/en"} lang={isEnglish ? "fr" : "en"}>{isEnglish ? "FR" : "EN"}</a>
          <a className="header-cta" href={sectionHref("#contact")}>{isEnglish ? "Let's talk about your project" : "Parlons de votre projet"}</a>
          <button type="button" className="menu-toggle" aria-label={mobileOpen ? (isEnglish ? "Close menu" : "Fermer le menu") : (isEnglish ? "Open menu" : "Ouvrir le menu")} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((value) => !value)}>
            <span /><span />
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${mobileOpen ? "is-open" : ""}`} aria-label={isEnglish ? "Mobile navigation" : "Navigation mobile"}>
        <div className="mobile-expertise">
          <button type="button" className="mobile-expertise__trigger" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {isEnglish ? "Expertise" : "Expertises"}<span>{open ? "−" : "+"}</span>
          </button>
          {open && <div className="mobile-expertise__content">
            {categories.map((category) => (
              <div className="mobile-expertise__group" key={category.id}>
                <button type="button" className="mobile-expertise__category" onClick={() => setActiveCategory(activeCategory === category.id ? "" : category.id)} aria-expanded={activeCategory === category.id}>
                  <strong>{category.title}</strong><span>{activeCategory === category.id ? "−" : "+"}</span>
                </button>
                {activeCategory === category.id && <div className="mobile-expertise__services">
                  {category.services.map((service) => <a key={service.title} href={sectionHref("#expertises")} onClick={closeMenus}>{service.title}<span>↗</span></a>)}
                </div>}
              </div>
            ))}
          </div>}
        </div>
        {links.map((link) => <a key={link.href} href={sectionHref(link.href)} onClick={closeMenus}>{link.label}<span>↗</span></a>)}
        <a href={isEnglish ? "/" : "/en"} onClick={closeMenus}>{isEnglish ? "Français" : "English"}<span>↗</span></a>
      </nav>
    </header>
  );
}

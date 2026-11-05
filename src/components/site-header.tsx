"use client";

import { useState } from "react";

type SiteHeaderProps = { locale?: "fr" | "en"; homeHref?: string };

const navigation = {
  fr: [
    { href: "#expertises", label: "Expertises" },
    { href: "#realisations", label: "Réalisations" },
    { href: "#processus", label: "Notre méthode" },
    { href: "/tarifs", label: "Tarifs" },
    { href: "#contact", label: "Contact" },
  ],
  en: [
    { href: "#expertises", label: "Expertise" },
    { href: "#realisations", label: "Selected work" },
    { href: "#processus", label: "Our process" },
    { href: "/en/pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ],
};

export function SiteHeader({ locale = "fr", homeHref = "" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const links = navigation[locale];
  const isEnglish = locale === "en";
  const sectionHref = (href: string) => href.startsWith("#") && homeHref ? `${homeHref}${href}` : href;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href={isEnglish ? "/en" : "/"} className="brand" aria-label="NOKAY, home">NOKAY<span>.</span></a>
        <nav className="desktop-nav" aria-label={isEnglish ? "Main navigation" : "Navigation principale"}>
          {links.map((link) => <a key={link.href} href={sectionHref(link.href)}>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="language-switch" href={isEnglish ? "/" : "/en"} lang={isEnglish ? "fr" : "en"}>{isEnglish ? "FR" : "EN"}</a>
          <a className="header-cta" href={sectionHref("#contact")}>{isEnglish ? "Let's talk about your project" : "Parlons de votre projet"} <span aria-hidden="true">↗</span></a>
          <button type="button" className="menu-toggle" aria-label={open ? (isEnglish ? "Close menu" : "Fermer le menu") : (isEnglish ? "Open menu" : "Ouvrir le menu")} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
            <span /><span />
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label={isEnglish ? "Mobile navigation" : "Navigation mobile"}>
        {links.map((link) => <a key={link.href} href={sectionHref(link.href)} onClick={() => setOpen(false)}>{link.label}<span>↗</span></a>)}
        <a href={isEnglish ? "/" : "/en"} onClick={() => setOpen(false)}>{isEnglish ? "Français" : "English"}<span>↗</span></a>
      </nav>
    </header>
  );
}

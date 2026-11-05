"use client";

import { useState } from "react";

const links = [
  { href: "#expertises", label: "Expertises" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#processus", label: "Notre méthode" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" className="brand" aria-label="NOKAY, accueil">NOKAY<span>.</span></a>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <a className="header-cta" href="#contact">Parlons de votre projet <span aria-hidden="true">↗</span></a>
        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-label="Navigation mobile">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>↗</span></a>
        ))}
      </nav>
    </header>
  );
}

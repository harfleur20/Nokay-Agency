"use client";

import { useId, useState } from "react";
import Link from "next/link";

export type EditorialAccordionItem = {
  title: string;
  description: string;
  meta?: string;
  tag?: string;
  href?: string;
  linkLabel?: string;
};

export function EditorialAccordion({
  items,
  locale = "fr",
  className = "",
}: {
  items: readonly EditorialAccordionItem[];
  locale?: "fr" | "en";
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const id = useId();

  return (
    <div className={`editorial-accordion ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${id}-panel-${index}`;

        return (
          <section className={`editorial-accordion__item ${isOpen ? "is-open" : ""}`} key={item.title}>
            <h3 className="editorial-accordion__heading">
              <button
                className="editorial-accordion__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.title}</span>
                <span className="editorial-accordion__icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div className="editorial-accordion__panel" id={panelId} aria-hidden={!isOpen}>
              <div className="editorial-accordion__panel-inner">
                <div className="editorial-accordion__content">
                  {(item.meta || item.tag) && <p className="editorial-accordion__meta">{item.meta || item.tag}</p>}
                  <p className="editorial-accordion__description">{item.description}</p>
                  {item.href && (
                    <Link className="editorial-accordion__link" href={item.href}>
                      {item.linkLabel ?? (locale === "en" ? "Explore this expertise" : "Découvrir cette expertise")} <span aria-hidden="true">⟶</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

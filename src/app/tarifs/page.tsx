import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "Tarifs & packages",
  description: "Découvrez les packages NOKAY pour les sites vitrines, applications web, produits SaaS et le design graphique.",
  alternates: { canonical: "/tarifs" },
};

export default function TarifsPage() {
  return <PricingPage locale="fr" />;
}

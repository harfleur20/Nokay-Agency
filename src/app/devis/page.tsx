import type { Metadata } from "next";
import { QuotePage } from "@/components/quote-page";

export const metadata: Metadata = { title: "Demander un devis", description: "Présentez votre projet à NOKAY et recevez une proposition adaptée.", alternates: { canonical: "/devis" } };

export default async function DevisPage({ searchParams }: { searchParams: Promise<{ service?: string; package?: string }> }) {
  const params = await searchParams;
  const service = ["websites", "apps", "saas", "design"].includes(params.service || "") ? params.service || "" : "";
  return <QuotePage locale="fr" service={service} packageName={(params.package || "").slice(0, 100)} />;
}

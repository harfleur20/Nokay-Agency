import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertisePage } from "@/components/expertise-page";
import { expertiseFr } from "@/lib/expertise-fr";

const labels = {
  "sites-vitrines": "Sites vitrines",
  "applications-web": "Applications web",
  saas: "Produits SaaS",
  "design-communication": "Design & communication",
  "seo-geo": "SEO / GEO",
  "publicite-en-ligne": "Publicité en ligne",
} as const;

export function generateStaticParams() { return Object.keys(expertiseFr).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = expertiseFr[slug as keyof typeof expertiseFr];
  return item ? { title: item.title, description: item.intro } : {};
}
export default async function ExpertiseRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = expertiseFr[slug as keyof typeof expertiseFr];
  if (!item) notFound();
  const others = Object.entries(labels).filter(([key]) => key !== slug).map(([key, label]) => ({ href: `/expertises/${key}`, label }));
  return <ExpertisePage content={item} locale="fr" otherServices={others} />;
}

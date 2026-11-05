import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertisePage } from "@/components/expertise-page";
import { expertiseEn } from "@/lib/expertise-en";

const labels = {
  websites: "Websites",
  "web-applications": "Web applications",
  saas: "SaaS products",
  "design-communication": "Design & communication",
  "seo-geo": "SEO / GEO",
  "online-advertising": "Online advertising",
} as const;

export function generateStaticParams() { return Object.keys(expertiseEn).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = expertiseEn[slug as keyof typeof expertiseEn];
  return item ? { title: item.title, description: item.intro } : {};
}
export default async function EnglishExpertiseRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = expertiseEn[slug as keyof typeof expertiseEn];
  if (!item) notFound();
  const others = Object.entries(labels).filter(([key]) => key !== slug).map(([key, label]) => ({ href: `/en/expertise/${key}`, label }));
  return <ExpertisePage content={item} locale="en" otherServices={others} />;
}

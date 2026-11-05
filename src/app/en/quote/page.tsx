import type { Metadata } from "next";
import { QuotePage } from "@/components/quote-page";

export const metadata: Metadata = { title: "Request a quote", description: "Tell NOKAY about your project and receive a tailored proposal.", alternates: { canonical: "/en/quote" } };

export default async function QuoteRoute({ searchParams }: { searchParams: Promise<{ service?: string; package?: string }> }) {
  const params = await searchParams;
  const service = ["websites", "apps", "saas", "design"].includes(params.service || "") ? params.service || "" : "";
  return <QuotePage locale="en" service={service} packageName={(params.package || "").slice(0, 100)} />;
}

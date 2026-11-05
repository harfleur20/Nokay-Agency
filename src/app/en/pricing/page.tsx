import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "Pricing & packages",
  description: "Explore NOKAY packages for websites, web applications, SaaS products and graphic design.",
  alternates: { canonical: "/en/pricing" },
};

export default function PricingRoute() {
  return <PricingPage locale="en" />;
}

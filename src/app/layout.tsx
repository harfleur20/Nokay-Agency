import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "NOKAY — Ideas into digital experiences", template: "%s | NOKAY" },
  description: "NOKAY imagine et développe des sites vitrines, applications web, produits SaaS et identités visuelles.",
  applicationName: "NOKAY",
  keywords: ["agence digitale", "site vitrine", "application web", "SaaS", "design graphique", "UI UX"],
  alternates: { languages: { fr: "/", en: "/en" } },
  openGraph: { title: "NOKAY — Ideas into digital experiences", description: "NOKAY imagine et développe des sites vitrines, applications web, produits SaaS et identités visuelles.", siteName: "NOKAY", locale: "fr_FR", type: "website" },
  twitter: { card: "summary_large_image", title: "NOKAY — Ideas into digital experiences", description: "Creative & technology digital agency." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: { default: "Osez. — Studio digital créatif", template: "%s | Osez." },
  description: "Osez. imagine et développe des sites vitrines, applications web, produits SaaS et identités visuelles.",
  applicationName: "Osez.",
  keywords: ["agence digitale", "site vitrine", "application web", "SaaS", "design graphique", "UI UX"],
  alternates: { languages: { fr: "/", en: "/en" } },
  openGraph: { title: "Osez. — Studio digital créatif", description: "Osez. imagine et développe des sites vitrines, applications web, produits SaaS et identités visuelles.", siteName: "Osez.", locale: "fr_FR", type: "website" },
  twitter: { card: "summary_large_image", title: "Osez. — Studio digital créatif", description: "Creative digital studio." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}

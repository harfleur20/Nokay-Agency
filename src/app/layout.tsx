import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NOKAY — Ideas into digital experiences", template: "%s | NOKAY" },
  description: "NOKAY imagine et développe des sites vitrines, applications web, produits SaaS et identités visuelles.",
  applicationName: "NOKAY",
  keywords: ["agence digitale", "site vitrine", "application web", "SaaS", "design graphique", "UI UX"],
  alternates: { languages: { fr: "/", en: "/en" } },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NOKAY — Ideas into digital experiences",
    template: "%s | NOKAY",
  },
  description:
    "NOKAY conçoit des expériences digitales : sites web, applications, SaaS et identités visuelles.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

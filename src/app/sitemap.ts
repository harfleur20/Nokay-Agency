import type { MetadataRoute } from "next";

const publicPaths = [
  "/", "/en", "/tarifs", "/en/pricing",
  "/expertises/sites-vitrines",
  "/expertises/applications-web",
  "/expertises/saas",
  "/expertises/design-communication",
  "/en/expertise/websites",
  "/en/expertise/web-applications",
  "/en/expertise/saas",
  "/en/expertise/design-communication",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];
  let base: URL;
  try { base = new URL(siteUrl); } catch { return []; }
  if (base.protocol !== "https:" && base.hostname !== "localhost") return [];
  const lastModified = new Date();
  return publicPaths.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified,
    changeFrequency: path === "/" || path === "/en" ? "weekly" : "monthly",
    priority: path === "/" || path === "/en" ? 1 : path.includes("tarifs") || path.includes("pricing") ? 0.8 : 0.7,
  }));
}

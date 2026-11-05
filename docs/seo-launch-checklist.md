# SEO et préparation au lancement

## Implémenté
- Métadonnées globales, Open Graph et Twitter Cards.
- URL publique configurable via `NEXT_PUBLIC_SITE_URL`.
- Sitemap des pages publiques françaises et anglaises.
- Robots.txt excluant les espaces d'administration, client et API.
- Attribut de langue localisé sur les zones de contenu FR/EN.

## À faire avant indexation
1. Définir `NEXT_PUBLIC_SITE_URL` avec le domaine de production HTTPS réel.
2. Vérifier que le sitemap produit les URLs du domaine public.
3. Ajouter les images Open Graph réelles de NOKAY et les textes alternatifs.
4. Vérifier titres/descriptions uniques de chaque route.
5. Vérifier les canonicals, redirections HTTP→HTTPS et version www/non-www.
6. Connecter Google Search Console et Bing Webmaster Tools.
7. Soumettre `/sitemap.xml` après déploiement.
8. Vérifier l'accessibilité, les Core Web Vitals et les pages 404.

Ne pas publier les pages légales avec des informations de société fictives. Les coordonnées légales, le statut, le SIREN/SIRET, la TVA et l'adresse doivent être fournis par l'entreprise.

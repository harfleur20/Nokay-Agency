# NOKAY — Feuille de route

## Phase 0 — Fondations
- [x] Dépôt, architecture et documentation initiale
- [x] Squelette Next.js / TypeScript et navigation responsive
- [x] Direction visuelle et première vitrine
- [ ] Installation locale et validation du build
- [ ] CI GitHub Actions exécutée avec succès

## Phase 1 — Design system et expérience publique
- [x] Direction visuelle initiale (noir, ivoire, vert électrique)
- [x] Accueil immersif, navigation responsive et animations accessibles
- [x] Expertises et pages détaillées en français et en anglais
- [x] Catalogue de tarifs et packages bilingues
- [x] Formulaires de contact et de devis bilingues
- [ ] Internationalisation complète des métadonnées HTML
- [ ] SEO technique, métadonnées sociales et données structurées
- [ ] Audit accessibilité et responsive sur appareils réels

## Phase 2 — Acquisition et CRM initial
- [x] Enregistrement durable des demandes de contact/devis dans PostgreSQL via Prisma
- [x] Notification e-mail Resend après persistance (configuration requise)
- [x] Première interface admin protégée par session HTTP-only
- [x] Connexion administrateur et création initiale via seed
- [x] Consultation des demandes, filtres de statut et journal d'audit des changements
- [x] Limitation de débit persistante PostgreSQL sur les endpoints publics et de connexion
- [ ] Recherche, filtres avancés, export CSV et assignation des leads
- [ ] Tests d'intégration DB et tests de sécurité

## Phase 3 — Devis, commandes et paiements
- [x] Création de devis brouillon depuis un lead dans le back-office
- [x] Envoi du récapitulatif d’un devis par e-mail via Resend
- [ ] Génération PDF, versionnement et acceptation client
- [ ] Commandes et acomptes configurables
- [ ] Stripe Checkout, webhooks signés et idempotents
- [ ] Factures, remboursements et historique de paiement

## Phase 4 — Back-office
- [ ] Gestion clients, rôles et permissions granulaires
- [x] Gestion initiale des prestations (création, activation/désactivation) depuis le back-office
- [x] Gestion initiale des projets, étapes, progression et actualités client depuis le back-office
- [ ] CMS, portfolio et références
- [ ] Traductions, notifications et journal d'audit complet

## Phase 5 — Espace client
- [x] Activation de compte client par invitation sécurisée et authentification
- [ ] Récupération et réinitialisation de mot de passe
- [x] Tableau de bord client et suivi de projet (lecture)
- [x] Consultation des devis, commandes et paiements enregistrés
- [ ] Paiement en ligne et téléchargement des factures
- [ ] Documents privés et notifications automatiques
- [ ] Contrôle d'isolation des données entre clients

## Phase 6 — Qualité, conformité et lancement
- [ ] Migrations Prisma versionnées et stratégie de sauvegarde/restauration
- [ ] Tests unitaires, intégration et E2E
- [ ] Audit sécurité et permissions
- [ ] Accessibilité WCAG 2.2 AA
- [ ] Performances et Core Web Vitals
- [ ] RGPD, cookies, mentions légales et CGV
- [ ] Déploiement production et configuration des variables d'environnement

## Configuration requise avant utilisation
1. Créer une base PostgreSQL et renseigner `DATABASE_URL`.
2. Définir `AUTH_SECRET` avec une valeur aléatoire d'au moins 32 caractères.
3. Définir `ADMIN_NAME`, `ADMIN_EMAIL` et un `ADMIN_PASSWORD` d'au moins 14 caractères.
4. Installer les dépendances, exécuter `npm run db:generate`, puis `npm run db:migrate` en local.
5. Exécuter `npm run db:seed` pour créer le compte administrateur initial.
6. Configurer Resend et un expéditeur vérifié pour recevoir les notifications.

## Décisions et informations métier encore nécessaires
- Coordonnées légales, statut, adresse, SIREN/SIRET, TVA et responsable de publication.
- Compte Stripe et règles de paiement, acomptes, échéanciers, annulations et remboursements.
- Hébergement applicatif, base PostgreSQL de production, stockage privé et domaine.
- Politique de conservation des données et procédure RGPD.
- Les prix affichés sont des prix de départ HT proposés et doivent être validés commercialement avant vente.

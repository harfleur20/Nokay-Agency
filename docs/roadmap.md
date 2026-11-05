# NOKAY — Feuille de route

## Phase 0 — Fondations
- [x] Dépôt et documentation initiale
- [x] Architecture cible
- [x] Squelette Next.js / TypeScript / Tailwind
- [x] Première navigation responsive
- [x] Première vitrine et tokens graphiques
- [x] Documentation de la direction technique
- [ ] Installation locale et validation du build
- [ ] CI GitHub Actions exécutée avec succès

## Phase 1 — Design system et expérience publique
- [x] Direction visuelle initiale (noir, ivoire, vert électrique)
- [x] Navigation responsive
- [x] Accueil immersif initial et animations accessibles
- [x] Sections expertises, concepts portfolio, références et processus
- [x] Pages détaillées par expertise en français et en anglais
- [x] Accueil et navigation disponibles en français et en anglais (base d'internationalisation)
- [ ] Internationalisation complète des métadonnées HTML et des pages restantes
- [x] Formulaire de contact bilingue avec validation serveur et envoi Resend (configuration requise)
- [ ] SEO technique complet, métadonnées sociales et données structurées
- [ ] Vérification accessibilité et responsive sur appareils réels

## Phase 2 — Catalogue et acquisition
- [x] Catalogue de prestations et packages tarifaires bilingues
- [x] Navigation Tarifs / Pricing
- [x] Formulaire de brief et demande de devis détaillé bilingue
- [x] Préremplissage du forfait sélectionné dans le brief
- [ ] Gestion persistante des demandes entrantes (base de données et back-office)
- [ ] E-mails transactionnels : nécessite la configuration Resend en production et tests réels

## Phase 3 — Commandes et paiements
- [ ] Devis PDF et workflow d'acceptation
- [ ] Commandes et acomptes configurables
- [ ] Paiements Stripe et webhooks idempotents
- [ ] Factures et historique

## Phase 4 — Back-office
- [ ] Authentification sécurisée et RBAC
- [ ] Gestion clients, services, devis et commandes
- [ ] Gestion projets et étapes
- [ ] CMS, portfolio et références
- [ ] Traductions et notifications

## Phase 5 — Espace client
- [ ] Tableau de bord client
- [ ] Suivi de projet
- [ ] Documents et paiements
- [ ] Notifications et préférences

## Phase 6 — Qualité, conformité et lancement
- [ ] Tests unitaires, intégration et E2E
- [ ] Audit sécurité et permissions
- [ ] Accessibilité WCAG 2.2 AA
- [ ] Performances et Core Web Vitals
- [ ] RGPD, cookies, mentions légales et CGV (informations juridiques et société à fournir)
- [ ] Documentation d'exploitation et procédure de sauvegarde
- [ ] Déploiement production et configuration des variables d'environnement

## Décisions et prérequis encore nécessaires
- Coordonnées légales de l'entreprise, statut, adresse, SIREN/SIRET, TVA et responsable de publication.
- Compte Stripe, paramètres de facturation, règles d'acompte, échéancier, annulation et remboursement.
- Fournisseur et configuration de base de données, stockage privé et authentification.
- Adresse e-mail de réception et domaine d'envoi vérifié chez Resend.
- Hébergement applicatif de production et domaine final.
- Les montants affichés sont des prix de départ HT proposés pour la grille NOKAY, pas des devis contractuels. Ils doivent être validés commercialement avant toute vente.

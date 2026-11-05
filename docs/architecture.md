# NOKAY — Architecture technique

## 1. Principes

- Monolithe modulaire Next.js : une seule application déployable, avec des domaines métier isolés.
- TypeScript strict, validation côté serveur et composants réutilisables.
- API et accès aux données exclusivement côté serveur lorsque des secrets ou données privées sont concernés.
- Bilingue FR/EN dès la conception.
- Sécurité, accessibilité, SEO et performances intégrés dès la V1.

## 2. Périmètre fonctionnel

### Site public
Accueil immersif, expertises, portfolio, références clients et partenaires, processus, offres, demande de devis, à propos et contact.

### Espace commercial
Prestations standardisées, demandes de devis personnalisés, commandes, acomptes, échéances, paiements et documents.

### Espace client
Profil, devis, commandes, paiements, factures, documents, suivi des étapes projet et notifications. Chaque client ne peut accéder qu'à ses propres données.

### Back-office
Gestion des utilisateurs et rôles, prestations, devis, commandes, paiements, projets, portfolio, références, contenus, traductions et paramètres.

## 3. Stack

- Next.js App Router, React et TypeScript.
- Tailwind CSS pour les styles.
- GSAP et Framer Motion pour les animations (avec prise en charge de prefers-reduced-motion).
- PostgreSQL et Prisma pour la persistance.
- Stripe pour les paiements et webhooks signés.
- Resend pour les e-mails transactionnels.
- Stockage objet privé compatible S3 pour les médias et documents.
- Vitest et Playwright pour les tests.
- GitHub Actions pour l'intégration continue.

## 4. Organisation cible

```text
src/
  app/
    [locale]/
      (marketing)/
      (auth)/
      (client)/
      (admin)/
    api/
  components/
    ui/
    layout/
    marketing/
  features/
    auth/
    customers/
    services/
    quotes/
    orders/
    payments/
    projects/
    portfolio/
    references/
    cms/
    notifications/
  lib/
    db/
    auth/
    payments/
    email/
    storage/
    i18n/
  server/
    services/
    repositories/
  types/
prisma/
  schema.prisma
messages/
  fr.json
  en.json
tests/
  unit/
  e2e/
docs/
```

Cette structure est une cible : les dossiers seront ajoutés au rythme des fonctionnalités, sans créer prématurément des modules vides.

## 5. Modèle métier — première version

Entités pressenties : User, Role, CustomerProfile, Service, ServiceTranslation, Quote, QuoteLine, Order, OrderLine, Payment, Invoice, Project, ProjectMilestone, PortfolioItem, ClientReference, PartnerReference, MediaAsset, Page, Notification et AuditLog.

Les montants seront stockés en unités monétaires mineures (centimes) avec une devise explicite. Les statuts de paiement seront confirmés côté serveur à partir des webhooks Stripe, jamais à partir d'une simple redirection navigateur.

## 6. Sécurité

- RBAC (super admin, admin, chef de projet, client).
- Vérification des droits sur chaque ressource côté serveur.
- Cloisonnement des données client.
- Validation des entrées, protection contre XSS, CSRF et injections.
- Limitation des tentatives et journalisation des événements sensibles.
- Secrets uniquement dans les variables d'environnement.
- Webhooks Stripe avec vérification de signature et idempotence.
- Documents privés servis via URLs signées à durée limitée.
- Sauvegardes et procédure de restauration documentées.

## 7. Périmètre exclu de l'offre V1

NOKAY ne commercialise pas l'hébergement ni l'infrastructure Cloud dans son offre initiale. Un prestataire externe prend en charge ce volet. Le stockage objet utilisé en interne pour les fichiers applicatifs reste un composant technique.

## 8. Décisions à confirmer avant les modules métier

- Solution d'authentification et stratégie de sessions.
- Pays, devise(s), régime fiscal et règles de facturation.
- Politique de conservation des données et documents.
- Prestataire et région de stockage objet.
- Règles précises d'acompte, d'annulation et de remboursement.

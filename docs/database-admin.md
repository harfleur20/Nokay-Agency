# Base de données et accès administrateur NOKAY

## Modèle de données
Le schéma Prisma couvre les utilisateurs et rôles, leads, prestations, devis, commandes, paiements, projets, mises à jour projet, portfolio et journal d'audit.

## Installation locale
1. Copier `.env.example` vers `.env`.
2. Créer une base PostgreSQL vide et renseigner `DATABASE_URL`.
3. Générer un secret avec `openssl rand -base64 48` et le renseigner dans `AUTH_SECRET`.
4. Renseigner `ADMIN_NAME`, `ADMIN_EMAIL` et `ADMIN_PASSWORD` (14 caractères minimum).
5. Installer : `npm install`.
6. Générer le client : `npm run db:generate`.
7. Appliquer les migrations : `npx prisma migrate deploy` (première installation) ou `npm run db:migrate` en développement.
8. Créer le compte initial : `npm run db:seed`.
9. Lancer : `npm run dev`.
10. Ouvrir `/admin/login`.

## Fonctionnement
- Les formulaires publics enregistrent d'abord le lead dans PostgreSQL.
- Resend sert uniquement à notifier l'équipe ; une panne de notification ne supprime pas le lead.
- Les leads sont consultables dans `/admin`.
- Les statuts sont modifiables et chaque changement écrit une entrée dans `AuditLog`.
- Le catalogue interne des prestations permet la création et l’activation/désactivation.
- Les brouillons de devis peuvent être créés à partir d’un lead ; le récapitulatif peut être envoyé au client via Resend. Les PDF et signatures électroniques restent à développer.
- Les projets peuvent être créés pour un contact client, suivre une étape et une progression, et recevoir des actualités dont la visibilité client est paramétrable. Le portail client et son authentification restent à construire.
- Le cookie de session est HTTP-only, SameSite=Lax et Secure en production.
- Le rôle et l'état actif sont revérifiés en base pour chaque accès protégé.

## Sécurité et exploitation
- Ne jamais committer `.env`, mots de passe, secrets JWT ou clés de fournisseur.
- Créer le compte administrateur via le seed, puis retirer les variables ADMIN_* de l'environnement de déploiement après l'initialisation si le seed n'est plus utilisé.
- Limitation persistante PostgreSQL : 5 demandes publiques par IP et par fenêtre de 15 minutes ; 5 tentatives de connexion admin par IP et par fenêtre de 15 minutes. Les identifiants réseau sont hachés et non conservés en clair.
- Vérifier que le proxy de production fournit un en-tête client IP fiable (`x-real-ip` ou `x-forwarded-for`) ; configurer le proxy pour empêcher l’usurpation de cet en-tête.
- Activer sauvegardes PostgreSQL chiffrées et tester régulièrement une restauration.
- Définir la durée de conservation et la procédure d'effacement des demandes conformément au RGPD.
- Les rôles PROJECT_MANAGER et ADMIN ont actuellement le même accès au tableau des leads ; les permissions fines restent à implémenter.


## Espace client initial
- Le premier envoi d'un devis à un contact crée une invitation d'activation valable 72 heures pour son compte client.
- Le token d'invitation est stocké sous forme de hash et ne peut être utilisé qu'une seule fois.
- L'espace `/account` affiche uniquement les projets, actualités visibles, devis et commandes du compte connecté.
- Les clients ne peuvent pas accéder aux routes `/api/admin/*` ; les endpoints admin revérifient les rôles.


## Paiements Stripe
- Un devis accepté peut être converti en commande depuis le back-office ; l'acompte peut être défini entre 0 et 100 %.
- Le client connecté peut payer l'acompte ou le solde depuis son espace.
- Une session Checkout ouverte est réutilisée pour éviter les doublons ; une session expirée libère la commande pour une nouvelle tentative.
- Le webhook vérifie la signature Stripe et met à jour le paiement de manière idempotente.
- Configurer `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` et `AUTH_URL`.
- Déclarer dans Stripe l'endpoint `/api/stripe/webhook` et au minimum les événements `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` et `payment_intent.payment_failed`.
- Tester en mode Stripe test avant toute activation en production. Les factures PDF, remboursements et règles de TVA ne sont pas inclus.


## Sécurité des comptes clients
- Le client peut accepter ou refuser un devis uniquement si celui-ci lui appartient et qu'il est au statut `SENT`.
- La décision est atomique et inscrite dans le journal d'audit.
- Le parcours mot de passe oublié ne révèle pas si une adresse existe.
- Les liens de réinitialisation sont à usage unique, stockés sous forme de hash et expirent après une heure.
- Les demandes de réinitialisation sont limitées à cinq par IP et par fenêtre de quinze minutes.

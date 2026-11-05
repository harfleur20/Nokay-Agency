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

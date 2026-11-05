# Formulaire de contact NOKAY

Le formulaire français et anglais envoie les demandes à `POST /api/contact`. L'API valide les champs côté serveur et transmet le message avec Resend.

Configurer ces variables dans l'environnement de déploiement :

- `RESEND_API_KEY` : clé API Resend, conservée uniquement côté serveur.
- `RESEND_FROM_EMAIL` : adresse expéditrice vérifiée chez Resend, par exemple `NOKAY <contact@votre-domaine.fr>`.
- `CONTACT_EMAIL` : adresse de réception des demandes.

Sans ces variables, l'API répond `503` et le formulaire affiche une erreur : aucune demande n'est présentée comme envoyée. Les demandes ne sont pas stockées en base pour le moment.

Avant une mise en production publique, ajouter une limitation de débit persistante (Redis/KV ou WAF), définir une durée de conservation, publier la politique de confidentialité et vérifier les obligations RGPD. Le champ honeypot réduit certains envois automatisés mais ne remplace pas une protection anti-abus.

export type Locale = "fr" | "en";

export const pricing = {
  fr: {
    eyebrow: "Des budgets lisibles, des projets bien cadrés",
    title: "Le bon niveau<br />pour <em>vos ambitions.</em>",
    intro: "Des forfaits de départ pour les besoins récurrents. Chaque projet est confirmé par un périmètre écrit avant le lancement.",
    note: "Prix indicatifs en euros HT. Le tarif final dépend du périmètre validé dans le devis. Aucun abonnement d’hébergement ou service cloud n’est vendu par NOKAY.",
    categories: [
      { id: "websites", title: "Sites vitrines", intro: "Une présence en ligne claire, rapide et conçue pour convertir.", packages: [
        { name: "Essentiel", price: "1 800 €", suffix: "forfait", description: "Pour lancer une présence professionnelle.", features: ["Jusqu’à 5 pages", "Design responsive adapté à votre identité", "Formulaire de contact", "SEO technique de base", "Mise en ligne et prise en main"], timeline: "2 à 4 semaines", featured: false },
        { name: "Business", price: "3 500 €", suffix: "forfait", description: "Pour présenter votre activité et développer vos demandes.", features: ["Jusqu’à 10 pages", "Direction artistique et UI sur mesure", "Animations et interactions soignées", "Optimisation SEO on-page de base", "Analytics et formation à la prise en main"], timeline: "4 à 6 semaines", featured: true },
        { name: "Premium", price: "5 900 €", suffix: "à partir de", description: "Pour une expérience de marque plus immersive.", features: ["Jusqu’à 15 pages", "Design et expérience entièrement personnalisés", "Animations avancées et micro-interactions", "Architecture de contenu et SEO renforcés", "Composants éditoriaux évolutifs"], timeline: "6 à 9 semaines", featured: false },
      ]},
      { id: "apps", title: "Applications web", intro: "Des outils métiers et plateformes conçus autour de vos processus.", packages: [
        { name: "Starter", price: "4 500 €", suffix: "à partir de", description: "Un premier outil métier avec un périmètre maîtrisé.", features: ["Cadrage fonctionnel initial", "Jusqu’à 5 écrans principaux", "Authentification simple si nécessaire", "Modèle de données initial", "Tests fonctionnels et documentation"], timeline: "4 à 8 semaines", featured: false },
        { name: "Business", price: "8 500 €", suffix: "à partir de", description: "Une application complète pour structurer votre activité.", features: ["Jusqu’à 12 écrans principaux", "Gestion des rôles selon le besoin", "Tableau de bord et exports simples", "Intégration d’une API tierce", "Tests, documentation et transfert"], timeline: "8 à 12 semaines", featured: true },
        { name: "Sur mesure", price: "Sur devis", suffix: "cadrage préalable", description: "Pour les plateformes et workflows complexes.", features: ["Architecture adaptée au contexte", "Fonctionnalités et intégrations spécifiques", "Reprise de données si nécessaire", "Sécurité et permissions détaillées", "Plan de livraison par lots"], timeline: "Selon périmètre", featured: false },
      ]},
      { id: "saas", title: "Produits SaaS", intro: "De la validation d’une idée au lancement d’un produit logiciel.", packages: [
        { name: "MVP", price: "8 000 €", suffix: "à partir de", description: "Valider une proposition de valeur avec un premier produit.", features: ["Atelier de cadrage produit", "Parcours utilisateur prioritaire", "Comptes et authentification", "Fonctionnalités cœur du MVP", "Socle technique évolutif"], timeline: "8 à 12 semaines", featured: false },
        { name: "Growth", price: "16 000 €", suffix: "à partir de", description: "Structurer un produit prêt à accueillir ses premiers clients.", features: ["Fonctionnalités métier élargies", "Rôles et espace utilisateur", "Paiement ou abonnement si pertinent", "Back-office opérationnel", "Suivi qualité et documentation"], timeline: "12 à 18 semaines", featured: true },
        { name: "Enterprise", price: "Sur devis", suffix: "cadrage préalable", description: "Un produit complexe, multi-profils ou fortement intégré.", features: ["Ateliers produit et architecture", "Multi-tenant ou règles métier avancées", "Intégrations et automatisations", "Exigences de sécurité spécifiques", "Accompagnement par étapes"], timeline: "Selon périmètre", featured: false },
      ]},
      { id: "design", title: "Design graphique & communication", intro: "Une identité cohérente et des supports qui expriment votre marque.", packages: [
        { name: "Identité visuelle", price: "950 €", suffix: "à partir de", description: "Poser les bases visuelles d’une marque.", features: ["Exploration créative", "Logo principal et déclinaisons essentielles", "Palette et typographies", "Mini-guide d’utilisation", "Fichiers finaux web et print"], timeline: "2 à 3 semaines", featured: false },
        { name: "Branding complet", price: "2 400 €", suffix: "à partir de", description: "Construire un univers de marque distinctif et cohérent.", features: ["Direction artistique", "Système de logo et identité complète", "Charte graphique détaillée", "Éléments graphiques et iconographie", "Applications sur supports prioritaires"], timeline: "3 à 5 semaines", featured: true },
        { name: "Pack communication", price: "1 500 €", suffix: "à partir de", description: "Déployer votre marque sur vos supports essentiels.", features: ["Direction visuelle de campagne", "Jusqu’à 5 supports définis au brief", "Déclinaisons réseaux sociaux", "Visuels web ou print", "Exports prêts à diffuser"], timeline: "2 à 4 semaines", featured: false },
      ]},
    ],
    extrasTitle: "Un besoin qui sort du cadre ?",
    extrasText: "E-commerce, refonte, motion design, vidéo promotionnelle, UX research ou accompagnement créatif : décrivez votre contexte et nous construirons une proposition adaptée.",
    cta: "Construire mon devis",
    packageCta: "Demander ce forfait",
    timeline: "Délai indicatif",
    included: "Inclus dans le forfait",
    footerNote: "Les contenus, licences, achats de médias, impressions, frais de services tiers et évolutions hors périmètre sont chiffrés séparément. Les délais commencent après validation du brief et réception des éléments nécessaires.",
  },
  en: {
    eyebrow: "Clear budgets, well-scoped projects",
    title: "The right scope<br />for <em>your ambition.</em>",
    intro: "Starting packages for common needs. Every project is confirmed with a written scope before work begins.",
    note: "Indicative prices in euros excluding VAT. Final pricing depends on the scope approved in the quote. NOKAY does not sell hosting or cloud services.",
    categories: [
      { id: "websites", title: "Websites", intro: "A clear, fast online presence designed to convert.", packages: [
        { name: "Essential", price: "€1,800", suffix: "fixed package", description: "For a professional online launch.", features: ["Up to 5 pages", "Responsive design tailored to your brand", "Contact form", "Core technical SEO", "Launch and handover"], timeline: "2–4 weeks", featured: false },
        { name: "Business", price: "€3,500", suffix: "fixed package", description: "For showcasing your business and generating enquiries.", features: ["Up to 10 pages", "Custom art direction and UI", "Refined animations and interactions", "Core on-page SEO", "Analytics and handover training"], timeline: "4–6 weeks", featured: true },
        { name: "Premium", price: "€5,900", suffix: "starting at", description: "For a more immersive brand experience.", features: ["Up to 15 pages", "Fully tailored design and experience", "Advanced motion and micro-interactions", "Enhanced content architecture and SEO", "Scalable editorial components"], timeline: "6–9 weeks", featured: false },
      ]},
      { id: "apps", title: "Web applications", intro: "Business tools and platforms built around your workflows.", packages: [
        { name: "Starter", price: "€4,500", suffix: "starting at", description: "A first business tool with a controlled scope.", features: ["Initial functional discovery", "Up to 5 main screens", "Basic authentication if required", "Initial data model", "Functional testing and documentation"], timeline: "4–8 weeks", featured: false },
        { name: "Business", price: "€8,500", suffix: "starting at", description: "A complete application to structure your operations.", features: ["Up to 12 main screens", "Role management as needed", "Dashboard and simple exports", "One third-party API integration", "Testing, documentation and handover"], timeline: "8–12 weeks", featured: true },
        { name: "Custom", price: "On request", suffix: "scoping first", description: "For complex platforms and workflows.", features: ["Context-specific architecture", "Custom features and integrations", "Data migration if required", "Detailed security and permissions", "Phased delivery plan"], timeline: "Scope dependent", featured: false },
      ]},
      { id: "saas", title: "SaaS products", intro: "From validating an idea to launching a software product.", packages: [
        { name: "MVP", price: "€8,000", suffix: "starting at", description: "Validate a value proposition with a first product.", features: ["Product discovery workshop", "Priority user journeys", "Accounts and authentication", "Core MVP features", "Scalable technical foundation"], timeline: "8–12 weeks", featured: false },
        { name: "Growth", price: "€16,000", suffix: "starting at", description: "Build a product ready for its first customers.", features: ["Expanded business features", "Roles and user area", "Payments or subscriptions if relevant", "Operational back office", "Quality follow-up and documentation"], timeline: "12–18 weeks", featured: true },
        { name: "Enterprise", price: "On request", suffix: "scoping first", description: "A complex, multi-role or deeply integrated product.", features: ["Product and architecture workshops", "Multi-tenant or advanced business rules", "Integrations and automation", "Specific security requirements", "Phased support"], timeline: "Scope dependent", featured: false },
      ]},
      { id: "design", title: "Graphic design & communication", intro: "A coherent identity and assets that express your brand.", packages: [
        { name: "Visual identity", price: "€950", suffix: "starting at", description: "Establish the visual foundations of a brand.", features: ["Creative exploration", "Primary logo and core variations", "Colour palette and typography", "Mini usage guide", "Final web and print files"], timeline: "2–3 weeks", featured: false },
        { name: "Complete branding", price: "€2,400", suffix: "starting at", description: "Build a distinctive and consistent brand universe.", features: ["Art direction", "Complete logo and identity system", "Detailed brand guidelines", "Graphic elements and iconography", "Applications on priority assets"], timeline: "3–5 weeks", featured: true },
        { name: "Communication pack", price: "€1,500", suffix: "starting at", description: "Roll out your brand across essential channels.", features: ["Campaign visual direction", "Up to 5 assets defined in the brief", "Social media adaptations", "Web or print visuals", "Ready-to-publish exports"], timeline: "2–4 weeks", featured: false },
      ]},
    ],
    extrasTitle: "Need something beyond these packages?",
    extrasText: "E-commerce, redesign, motion design, promotional video, UX research or creative support: tell us about your context and we'll shape a suitable proposal.",
    cta: "Build my quote",
    packageCta: "Request this package",
    timeline: "Estimated timeline",
    included: "Included in this package",
    footerNote: "Content production, licences, media purchases, printing, third-party service fees and out-of-scope changes are quoted separately. Timelines start after brief approval and receipt of required assets.",
  },
} as const;

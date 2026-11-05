export const expertiseFr = {
  "sites-vitrines": {
    title: "Sites vitrines",
    eyebrow: "Visibilité & conversion",
    intro: "Votre présence en ligne doit faire plus que vous présenter. Elle doit raconter votre valeur, inspirer confiance et donner envie d’agir.",
    description: "NOKAY conçoit des sites vitrines rapides, accessibles et faciles à faire évoluer. De la stratégie de contenu à la mise en ligne, chaque décision sert votre identité et vos objectifs.",
    outcomes: ["Une identité digitale cohérente et mémorable", "Une expérience fluide sur mobile, tablette et ordinateur", "Une structure pensée pour le référencement naturel", "Des contenus et appels à l’action orientés conversion"],
    deliverables: ["Atelier de cadrage et arborescence", "Direction artistique et maquettes UI", "Développement responsive", "Intégration des contenus fournis", "Optimisation technique SEO de base", "Recette, mise en ligne et prise en main"],
    process: "Nous commençons par comprendre votre activité et vos publics. Nous définissons ensuite les pages et les messages essentiels, validons les maquettes, développons le site puis contrôlons son fonctionnement avant livraison.",
    cta: "Parlons de votre site",
  },
  "applications-web": {
    title: "Applications web",
    eyebrow: "Outils & expériences",
    intro: "Transformez vos processus en outils numériques simples, fiables et adaptés à la réalité de vos équipes.",
    description: "Portails métiers, espaces utilisateurs, plateformes de réservation ou outils internes : nous concevons des applications web sur mesure, avec une attention particulière portée aux usages et à la sécurité.",
    outcomes: ["Des parcours adaptés à vos utilisateurs", "Des fonctionnalités alignées sur vos processus", "Une interface responsive et accessible", "Une base technique maintenable et évolutive"],
    deliverables: ["Analyse fonctionnelle et user flows", "Architecture et spécifications", "Prototypes et design UI", "Développement frontend et backend", "Tests fonctionnels et sécurisation", "Documentation et accompagnement"],
    process: "Nous découpons le projet en fonctionnalités prioritaires. Un premier périmètre utile est défini, prototypé et développé, puis enrichi par itérations selon les retours et les besoins validés.",
    cta: "Décrivons votre application",
  },
  "saas": {
    title: "Produits SaaS",
    eyebrow: "Du produit à l’échelle",
    intro: "Donnez vie à un produit logiciel qui répond à un vrai besoin et peut grandir avec ses utilisateurs.",
    description: "De la première version exploitable à l’évolution d’un produit existant, NOKAY vous accompagne sur l’expérience, les fonctionnalités et la construction technique de votre SaaS.",
    outcomes: ["Une proposition de valeur clarifiée", "Un MVP concentré sur les usages essentiels", "Des comptes et parcours utilisateurs structurés", "Une conception pensée pour les évolutions futures"],
    deliverables: ["Cadrage produit et priorisation MVP", "Parcours, wireframes et prototype", "Conception de l’interface", "Développement des fonctionnalités", "Tests, retours et ajustements", "Documentation de livraison"],
    process: "Nous identifions le problème à résoudre, priorisons les fonctionnalités qui créent le plus de valeur et construisons une première version testable. Les évolutions s’appuient ensuite sur les usages observés.",
    cta: "Construisons votre produit",
  },
  "design-communication": {
    title: "Design & communication",
    eyebrow: "Identité & expression",
    intro: "Une marque forte ne se limite pas à un logo. Elle s’exprime avec cohérence à chaque point de contact.",
    description: "Nous créons des systèmes visuels et des supports de communication qui rendent votre marque reconnaissable, du premier écran à vos campagnes.",
    outcomes: ["Une identité visuelle reconnaissable", "Un langage graphique cohérent", "Des interfaces plus claires et intuitives", "Des contenus visuels adaptés à vos canaux"],
    deliverables: ["Recherche créative et moodboard", "Logo et système d’identité", "Charte graphique et déclinaisons", "UI/UX et design d’interfaces", "Supports de communication", "Motion design et contenus animés"],
    process: "Nous explorons plusieurs directions créatives à partir de votre positionnement. La piste retenue est développée en un système cohérent, documenté et décliné selon vos besoins.",
    cta: "Donnons forme à votre identité",
  },
} as const;

export type ExpertiseSlug = keyof typeof expertiseFr;

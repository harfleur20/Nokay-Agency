const services = [
  {
    number: "01",
    title: "Sites web",
    description: "Des sites vitrines singuliers, rapides et pensés pour transformer vos visiteurs en clients.",
  },
  {
    number: "02",
    title: "Applications web",
    description: "Des outils métier et expériences interactives conçus autour de vos usages.",
  },
  {
    number: "03",
    title: "SaaS",
    description: "Des produits numériques robustes, évolutifs et prêts à grandir avec vos ambitions.",
  },
  {
    number: "04",
    title: "Design & communication",
    description: "Identités visuelles, UI/UX, motion design et supports qui donnent du caractère à vos idées.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <a href="#" aria-label="NOKAY, accueil" className="text-2xl font-black tracking-[-0.08em]">
          NOKAY<span className="text-accent">.</span>
        </a>
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a className="transition hover:text-foreground" href="#expertises">Expertises</a>
          <a className="transition hover:text-foreground" href="#approche">Notre approche</a>
          <a className="transition hover:text-foreground" href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-accent hover:text-accent">
          Parlons de votre projet <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="mx-auto flex min-h-[76vh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-10">
        <p className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          <span className="h-px w-8 bg-accent" /> Agence digitale créative & technologique
        </p>
        <h1 className="max-w-5xl text-6xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-7xl lg:text-[clamp(5rem,10vw,9.5rem)]">
          Des idées fortes.
          <br />
          <span className="text-accent">Des expériences</span>
          <br />
          qui comptent.
        </h1>
        <div className="mt-12 flex flex-col justify-between gap-8 border-t border-white/15 pt-7 sm:flex-row sm:items-end">
          <p className="max-w-md text-base leading-7 text-muted">
            Nous imaginons et construisons des expériences digitales qui
            donnent vie aux ambitions des marques et des entreprises.
          </p>
          <a href="#expertises" className="group inline-flex items-center gap-4 text-sm font-semibold">
            Explorer nos expertises
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-lg text-background transition group-hover:rotate-45">↘</span>
          </a>
        </div>
      </section>

      <section id="expertises" className="border-t border-white/10 bg-[#15161a] px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Ce que nous faisons</p>
              <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Le digital, sans limites.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              De la première idée au produit final, nous réunissons créativité,
              stratégie et technologie.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.number} className="bg-[#15161a] p-8 transition-colors hover:bg-[#1c1e23] sm:p-10">
                <p className="mb-14 text-sm text-accent">{service.number}</p>
                <h3 className="mb-4 text-2xl font-semibold tracking-tight">{service.title}</h3>
                <p className="max-w-md text-sm leading-6 text-muted">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="approche" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Notre approche</p>
        <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">
          Comprendre. Imaginer. Construire. Faire évoluer.
        </h2>
        <p className="mt-7 max-w-xl text-base leading-7 text-muted">
          Chaque projet commence par l’écoute et se construit avec méthode,
          transparence et exigence.
        </p>
      </section>

      <footer id="contact" className="border-t border-white/10 px-6 py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-3xl font-black tracking-[-0.08em]">NOKAY<span className="text-accent">.</span></p>
            <p className="mt-3 text-sm text-muted">Ideas into digital experiences.</p>
          </div>
          <a href="mailto:contact@nok ay.example".replace(" ", "") className="text-sm text-muted transition hover:text-accent">
            Nous contacter ↗
          </a>
        </div>
      </footer>
    </main>
  );
}

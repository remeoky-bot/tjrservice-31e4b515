import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Heart, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import founder from "@/assets/founder.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos – Joseph Remeoky Tafita, fondateur | TJR Service" },
      { name: "description", content: "Découvrez TJR Service et son fondateur Joseph Remeoky Tafita. Notre mission, notre vision et nos valeurs pour accompagner vos projets digitaux et BTP." },
      { property: "og:title", content: "À propos – TJR Service" },
      { property: "og:description", content: "Mission, vision et valeurs de TJR Service." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="gradient-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">À propos</span>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Une <span className="text-gradient">passion</span> au service de vos projets</h1>
            <p className="mt-5 text-muted-foreground">
              Passionné par l'informatique, le développement web, les applications, le design graphique et les
              solutions techniques, j'accompagne les particuliers et les entreprises dans la réalisation de
              leurs projets grâce à des solutions modernes, fiables et adaptées à leurs besoins.
            </p>
            <div className="mt-6">
              <div className="font-display text-xl font-semibold">Joseph Remeoky Tafita</div>
              <div className="text-sm text-cyan-accent">Fondateur de TJR Service</div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 -z-10 rounded-3xl gradient-brand opacity-30 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-glow">
              <img src={founder.url} alt="Joseph Remeoky Tafita" className="h-auto w-full object-cover" width={800} height={800} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Notre mission", text: "Rendre les technologies et les solutions techniques accessibles à tous, avec qualité et transparence." },
            { icon: Eye, title: "Notre vision", text: "Devenir le partenaire de référence pour les entreprises malgaches qui veulent grandir grâce au digital." },
            { icon: Heart, title: "Nos valeurs", text: "Excellence, écoute, fiabilité, créativité et engagement durable envers nos clients." },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/10 bg-card p-7 shadow-card">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white shadow-glow">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow">
            Discutons de votre projet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { services } from "@/lib/site-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos Services – Développement, Design, BTP | TJR Service" },
      { name: "description", content: "Découvrez tous les services TJR Service : développement web et mobile, design graphique, maintenance informatique, architecture, BTP et électricité à Madagascar." },
      { property: "og:title", content: "Nos Services – TJR Service" },
      { property: "og:description", content: "Solutions digitales et techniques complètes pour particuliers et entreprises." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <Layout>
      <section className="relative gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">Services</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Des solutions complètes pour votre <span className="text-gradient">croissance</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Du web au chantier, en passant par le design et la maintenance — une expertise unifiée.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-8 shadow-card hover:border-cyan-accent/40"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full gradient-brand opacity-10 blur-3xl transition-opacity group-hover:opacity-25" />
              <div className="relative flex flex-col gap-5 sm:flex-row">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl gradient-brand text-white shadow-glow">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-2xl font-semibold">{s.title}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.tagline}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-cyan-accent" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/devis" className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow">
            Démarrer un projet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
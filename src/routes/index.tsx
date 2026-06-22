import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, MessageCircle, Sparkles, Rocket, Wallet,
  Headphones, Layers, ShieldCheck, CheckCircle2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { services, contactInfo } from "@/lib/site-data";
import heroImg from "@/assets/hero-tech.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TJR Service – Création site web & solutions tech à Madagascar" },
      { name: "description", content: "Agence digitale et BTP à Antananarivo : sites web, applications mobiles, design graphique, maintenance informatique et architecture. Demandez un devis gratuit." },
      { property: "og:title", content: "TJR Service – Agence digitale & BTP" },
      { property: "og:description", content: "Création de sites web, applications, design graphique et solutions techniques professionnelles à Madagascar." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <ServicesPreview />
      <WhyUs />
      <CTA />
    </Layout>
  );
}

const reasons = [
  { icon: ShieldCheck, title: "Service professionnel", text: "Une exécution rigoureuse, des livrables soignés." },
  { icon: Rocket, title: "Livraison rapide", text: "Des délais respectés grâce à un process agile." },
  { icon: Wallet, title: "Prix abordables", text: "Des tarifs justes adaptés au marché local." },
  { icon: Headphones, title: "Support réactif", text: "Une équipe disponible pour vous accompagner." },
  { icon: Layers, title: "Solutions personnalisées", text: "Chaque projet est unique, nos solutions aussi." },
  { icon: Sparkles, title: "Accompagnement complet", text: "De l'idée à la mise en ligne, et au-delà." },
];

function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-cyan-accent">
            <Sparkles className="h-3.5 w-3.5" /> Votre partenaire de confiance en technologies et en BTP
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Développez votre activité avec{" "}
            <span className="text-gradient">TJR Service</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Création de sites web, applications mobiles, logiciels, design graphique,
            maintenance informatique et solutions techniques professionnelles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/devis"
              className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              Demander un devis gratuit <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={contactInfo.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> Contacter sur WhatsApp
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {["Devis gratuit", "Réponse sous 24h", "Antananarivo & toute l'île"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-accent" /> {b}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-3xl gradient-brand opacity-30 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-glow animate-float-slow">
            <img
              src={heroImg}
              alt="Illustration technologique TJR Service"
              width={1280}
              height={1024}
              className="h-auto w-full object-cover"
              fetchPriority="high"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "50+", l: "Projets livrés" },
    { v: "30+", l: "Clients satisfaits" },
    { v: "6", l: "Domaines d'expertise" },
    { v: "24h", l: "Délai de réponse" },
  ];
  return (
    <section className="border-y border-white/5 bg-surface/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">Nos services</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Tout ce dont vous avez besoin, sous un seul toit</h2>
        <p className="mt-3 text-muted-foreground">Des solutions digitales et techniques complètes pour faire avancer vos projets.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-cyan-accent/40 hover:shadow-glow"
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full gradient-brand opacity-10 blur-2xl transition-opacity group-hover:opacity-25" />
            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white shadow-glow">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-accent" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-accent hover:underline">
          Voir tous nos services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="bg-surface/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">Pourquoi nous choisir</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Une équipe engagée à vos côtés</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl glass p-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-cyan-accent">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{r.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface px-6 py-14 text-center shadow-glow sm:px-12">
        <div className="absolute inset-0 -z-10 gradient-brand opacity-20" />
        <div className="absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-accent/30 blur-3xl" />
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Prêt à donner vie à votre projet ?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Recevez un devis personnalisé et gratuit sous 24h.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/devis" className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow">
            Demander mon devis <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}

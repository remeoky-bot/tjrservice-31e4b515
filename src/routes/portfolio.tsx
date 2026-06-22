import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import restaurantImg from "@/assets/proj-restaurant.jpg";
import realestateImg from "@/assets/proj-realestate.jpg";
import schoolImg from "@/assets/proj-school.jpg";
import pharmacyImg from "@/assets/proj-pharmacy.jpg";
import logosImg from "@/assets/proj-logos.jpg";
import flyersImg from "@/assets/proj-flyers.jpg";
import cardsImg from "@/assets/proj-cards.jpg";
import house3dImg from "@/assets/proj-house3d.jpg";

type Cat = "Tous" | "Web" | "Applications" | "Design" | "BTP" | "Branding";

interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  category: Exclude<Cat, "Tous">;
}

const projects: Project[] = [
  { title: "Site web restaurant", description: "Site vitrine moderne avec menu interactif et réservations.", tech: ["React", "Next.js", "Tailwind"], image: restaurantImg, category: "Web" },
  { title: "Site immobilier", description: "Plateforme de listings avec recherche avancée et galerie.", tech: ["React", "Node.js", "PostgreSQL"], image: realestateImg, category: "Web" },
  { title: "App gestion scolaire", description: "Suivi des notes, présences et communication parents-école.", tech: ["React Native", "Firebase"], image: schoolImg, category: "Applications" },
  { title: "App pharmacie", description: "Gestion des stocks médicaments et commandes clients.", tech: ["Flutter", "Supabase"], image: pharmacyImg, category: "Applications" },
  { title: "Collection de logos", description: "Identités visuelles minimales pour startups locales.", tech: ["Illustrator", "Figma"], image: logosImg, category: "Branding" },
  { title: "Flyers marketing", description: "Flyers promotionnels imprimés haute qualité.", tech: ["Photoshop", "InDesign"], image: flyersImg, category: "Design" },
  { title: "Cartes de visite premium", description: "Cartes élégantes finition gold sur noir.", tech: ["Illustrator", "Print"], image: cardsImg, category: "Branding" },
  { title: "Modélisation maison 3D", description: "Rendu réaliste d'une villa contemporaine.", tech: ["SketchUp", "Lumion"], image: house3dImg, category: "BTP" },
];

const cats: Cat[] = ["Tous", "Web", "Applications", "Design", "BTP", "Branding"];

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio – Projets web, mobile, design & BTP | TJR Service" },
      { name: "description", content: "Découvrez les projets réalisés par TJR Service : sites web, applications mobiles, identités visuelles et modélisations 3D." },
      { property: "og:title", content: "Portfolio – TJR Service" },
      { property: "og:description", content: "Une sélection de réalisations TJR Service." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [filter, setFilter] = useState<Cat>("Tous");
  const list = filter === "Tous" ? projects : projects.filter((p) => p.category === filter);
  return (
    <Layout>
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">Portfolio</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Nos <span className="text-gradient">réalisations</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Quelques projets qui illustrent notre savoir-faire à travers différents domaines.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === c ? "gradient-brand text-white shadow-glow" : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.article
              key={p.title}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-card shadow-card transition-all hover:-translate-y-1 hover:border-cyan-accent/40"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <span className="rounded-full bg-cyan-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan-accent">{p.category}</span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
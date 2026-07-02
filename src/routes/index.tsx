import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, Wrench, Warehouse, BarChart3, Sparkles, ArrowRight, Cpu } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-screen gradient-hero text-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-glow">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">NEXEL</div>
            <div className="-mt-1 text-[10px] uppercase tracking-[0.2em] text-cyan-accent">Manager Pro</div>
          </div>
        </div>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Modules</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="rounded-lg px-4 py-2 text-sm hover:bg-white/5">Se connecter</Link>
          <Link to="/auth" className="rounded-lg gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow">Démarrer</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-12 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-widest text-cyan-accent">
            <Sparkles className="h-3.5 w-3.5" /> ERP moderne pour boutiques
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            <span className="text-gradient">NEXEL Manager Pro</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Gérez votre boutique de téléphonie, d'informatique et de réparation avec un ERP tout-en-un : caisse, stock, réparations, catalogue intelligent, tableau de bord.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl gradient-brand px-6 py-3 font-medium text-white shadow-glow">
              Ouvrir mon espace <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="rounded-xl glass px-6 py-3 font-medium">Découvrir les modules</a>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Smartphone, title: "Caisse (POS)", d: "Encaissement rapide, multi-paiement (Mvola, Orange Money, Airtel Money, espèces)." },
            { icon: Warehouse, title: "Stock intelligent", d: "Mouvements, alertes seuil, inventaire, multi-boutique." },
            { icon: Wrench, title: "Réparations", d: "Fiche client, diagnostic, devis, statuts, restitution." },
            { icon: Cpu, title: "Catalogue intelligent", d: "Marques et modèles préconfigurés : iPhone, Samsung, Redmi, Tecno, Infinix…" },
            { icon: BarChart3, title: "Tableau de bord", d: "Ventes, marges, produits populaires, alertes stock." },
            { icon: ShieldCheck, title: "Rôles & sécurité", d: "Admin, gérant, vendeur, technicien, magasinier." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 shadow-card">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NEXEL Manager Pro. Antananarivo, Madagascar.
      </footer>
    </div>
  );
}
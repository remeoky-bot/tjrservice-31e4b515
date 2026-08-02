import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/tjr-logo.jpg.asset.json";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <img src={logo.url} alt="TJR Service" className="h-10 w-10 shrink-0 rounded-lg object-contain bg-white" />
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-tight">TJR Service</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Tech &amp; BTP</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "rounded-md px-3 py-2 text-sm text-foreground font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/devis"
            className="inline-flex items-center justify-center rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            Demander un devis
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-background">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-2.5 text-sm text-foreground bg-white/5 font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/devis"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
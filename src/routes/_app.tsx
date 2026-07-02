import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, ShoppingCart, Warehouse, Wrench, Package, Users, LogOut, Cpu, Settings, Menu } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app")({ component: AppLayout });

const NAV = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/pos", label: "Caisse", icon: ShoppingCart },
  { to: "/stock", label: "Stock", icon: Warehouse },
  { to: "/catalog", label: "Catalogue", icon: Package },
  { to: "/repairs", label: "Réparations", icon: Wrench },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/settings", label: "Paramètres", icon: Settings },
];

function AppLayout() {
  const { user, loading, signOut, roles } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center gradient-hero text-muted-foreground">Chargement…</div>;
  }

  return (
    <div className="min-h-screen gradient-hero text-foreground">
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/10 bg-[oklch(0.19_0.04_265)]/95 backdrop-blur transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
            <div className="grid h-9 w-9 place-items-center rounded-lg gradient-brand shadow-glow">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-bold leading-tight">NEXEL</div>
              <div className="-mt-0.5 text-[10px] uppercase tracking-widest text-cyan-accent">Manager Pro</div>
            </div>
          </div>
          <nav className="space-y-1 p-3">
            {NAV.map((n) => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? "gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
                  <n.icon className="h-4 w-4" />{n.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-3">
            <div className="mb-2 truncate px-2 text-xs text-muted-foreground">
              {user.email}<br /><span className="text-cyan-accent">{roles.join(", ") || "vendeur"}</span>
            </div>
            <button onClick={async () => { await signOut(); nav({ to: "/auth" }); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </aside>

        <div className="min-h-screen flex-1 md:pl-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[oklch(0.2_0.04_265)]/70 px-4 backdrop-blur md:px-8">
            <button className="md:hidden" onClick={() => setOpen(!open)}><Menu /></button>
            <div className="text-sm text-muted-foreground">Bienvenue, <span className="text-foreground">{user.email}</span></div>
          </header>
          <main className="p-4 md:p-8"><Outlet /></main>
        </div>
      </div>
    </div>
  );
}
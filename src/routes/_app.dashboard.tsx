import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Warehouse, Wrench, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

function Kpi({ icon: I, label, value, color }: any) {
  return (
    <div className="glass rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className={`grid h-9 w-9 place-items-center rounded-lg ${color}`}><I className="h-4 w-4 text-white" /></div>
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
    </div>
  );
}

function Dashboard() {
  const salesQ = useQuery({
    queryKey: ["dashboard-sales"],
    queryFn: async () => {
      const today = new Date(); today.setHours(0,0,0,0);
      const { data } = await supabase.from("sales").select("total, created_at").gte("created_at", today.toISOString());
      return data ?? [];
    },
  });
  const stockQ = useQuery({
    queryKey: ["dashboard-stock"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, stock_qty, min_stock, name");
      return data ?? [];
    },
  });
  const repairsQ = useQuery({
    queryKey: ["dashboard-repairs"],
    queryFn: async () => {
      const { data } = await supabase.from("repairs").select("id, status").in("status", ["recu","diagnostic","devis","en_reparation","pret"]);
      return data ?? [];
    },
  });

  const totalToday = (salesQ.data ?? []).reduce((s, r: any) => s + Number(r.total || 0), 0);
  const productsCount = stockQ.data?.length ?? 0;
  const lowStock = (stockQ.data ?? []).filter((p: any) => p.stock_qty <= p.min_stock);
  const openRepairs = repairsQ.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de votre boutique.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={ShoppingCart} label="Ventes du jour" value={`${totalToday.toLocaleString("fr-FR")} Ar`} color="gradient-brand" />
        <Kpi icon={Warehouse} label="Produits actifs" value={productsCount} color="bg-cyan-accent" />
        <Kpi icon={AlertTriangle} label="Stock bas" value={lowStock.length} color="bg-amber-500" />
        <Kpi icon={Wrench} label="Réparations en cours" value={openRepairs} color="bg-fuchsia-500" />
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-lg font-semibold">Alertes stock</h2>
        {lowStock.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune alerte. 👌</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {lowStock.slice(0, 8).map((p: any) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <span>{p.name}</span>
                <span className="text-amber-400">{p.stock_qty} / min {p.min_stock}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
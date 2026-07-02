import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, Search, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/pos")({ component: POS });

type Line = { id: string; name: string; qty: number; price: number };

function POS() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Line[]>([]);
  const [pay, setPay] = useState<"especes"|"mvola"|"orange_money"|"airtel_money"|"virement"|"carte">("especes");
  const [discount, setDiscount] = useState(0);

  const products = useQuery({
    queryKey:["pos-products", q],
    queryFn: async () => {
      let req = supabase.from("products").select("id,name,sale_price,stock_qty").order("name").limit(60);
      if (q) req = req.ilike("name", `%${q}%`);
      return (await req).data ?? [];
    },
  });

  const add = (p: any) => {
    setCart((c) => {
      const e = c.find(x => x.id === p.id);
      if (e) return c.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { id: p.id, name: p.name, qty: 1, price: Number(p.sale_price) }];
    });
  };

  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.price * l.qty, 0), [cart]);
  const total = Math.max(0, subtotal - discount);

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const { data: sale, error } = await supabase.from("sales").insert({
        subtotal, discount, total, payment_method: pay, user_id: user?.id,
      }).select().single();
      if (error) throw error;
      const items = cart.map(l => ({ sale_id: sale.id, product_id: l.id, product_name: l.name, qty: l.qty, unit_price: l.price, line_total: l.price * l.qty }));
      const { error: e2 } = await supabase.from("sale_items").insert(items);
      if (e2) throw e2;
      // Decrement stock via movements
      for (const l of cart) {
        await supabase.from("stock_movements").insert({ product_id: l.id, move_type: "vente", qty: l.qty, reference: sale.reference, user_id: user?.id });
      }
      toast.success(`Vente ${sale.reference} enregistrée`);
      setCart([]); setDiscount(0);
      qc.invalidateQueries({ queryKey:["pos-products"] });
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Caisse</h1>
        <p className="text-sm text-muted-foreground">Encaissement multi-paiement (Mvola, Orange Money, Airtel Money…).</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Rechercher un produit…" className="w-full bg-transparent py-2 outline-none" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(products.data ?? []).map((p: any) => (
              <button key={p.id} onClick={() => add(p)} className="rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-cyan-accent hover:bg-white/10">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Stock : {p.stock_qty}</span>
                  <span className="text-cyan-accent">{Number(p.sale_price).toLocaleString("fr-FR")} Ar</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><ShoppingCart className="h-5 w-5" /> Panier</h2>
          <ul className="mt-3 divide-y divide-white/5">
            {cart.map(l => (
              <li key={l.id} className="flex items-center gap-2 py-2">
                <div className="flex-1">
                  <div className="text-sm">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.price.toLocaleString("fr-FR")} Ar</div>
                </div>
                <input type="number" min={1} value={l.qty} onChange={(e)=>setCart(c=>c.map(x=>x.id===l.id?{...x,qty:Math.max(1,Number(e.target.value))}:x))} className="w-14 rounded bg-white/10 px-2 py-1 text-sm" />
                <button onClick={()=>setCart(c=>c.filter(x=>x.id!==l.id))} className="text-muted-foreground hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
            {cart.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Panier vide</li>}
          </ul>
          <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm">
            <div className="flex justify-between"><span>Sous-total</span><span>{subtotal.toLocaleString("fr-FR")} Ar</span></div>
            <div className="flex items-center justify-between"><span>Remise (Ar)</span>
              <input type="number" value={discount} onChange={(e)=>setDiscount(Math.max(0,Number(e.target.value)))} className="w-24 rounded bg-white/10 px-2 py-1 text-right" />
            </div>
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-cyan-accent">{total.toLocaleString("fr-FR")} Ar</span></div>
            <label className="block">
              <span className="text-xs text-muted-foreground">Paiement</span>
              <select value={pay} onChange={(e)=>setPay(e.target.value as any)} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <option value="especes">Espèces</option>
                <option value="mvola">Mvola</option>
                <option value="orange_money">Orange Money</option>
                <option value="airtel_money">Airtel Money</option>
                <option value="virement">Virement</option>
                <option value="carte">Carte</option>
              </select>
            </label>
            <button onClick={checkout} disabled={cart.length===0} className="mt-2 w-full rounded-lg gradient-brand px-4 py-2.5 font-medium text-white shadow-glow disabled:opacity-40">
              Encaisser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/stock")({ component: Stock });

function Stock() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<"entree" | "sortie" | "ajustement">("entree");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [ref, setRef] = useState("");

  const products = useQuery({ queryKey:["stock-products"], queryFn: async () => (await supabase.from("products").select("id,name,stock_qty").order("name")).data ?? [] });
  const moves = useQuery({ queryKey:["stock-moves"], queryFn: async () => (await supabase.from("stock_movements").select("*, products(name)").order("created_at",{ascending:false}).limit(50)).data ?? [] });

  const submit = useMutation({
    mutationFn: async () => {
      if (!productId || !qty) throw new Error("Produit et quantité requis");
      const { error } = await supabase.from("stock_movements").insert({
        product_id: productId, move_type: type, qty: Number(qty),
        reason: reason || null, reference: ref || null, user_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mouvement enregistré"); setQty(""); setReason(""); setRef("");
      qc.invalidateQueries({ queryKey: ["stock-moves"] });
      qc.invalidateQueries({ queryKey: ["stock-products"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock</h1>
        <p className="text-sm text-muted-foreground">Mouvements entrées / sorties / ajustements.</p>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-lg font-semibold">Nouveau mouvement</h2>
        <div className="grid gap-3 md:grid-cols-5">
          <label className="text-sm md:col-span-2">
            <span className="text-muted-foreground">Produit</span>
            <select value={productId} onChange={(e)=>setProductId(e.target.value)} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <option value="">Sélectionner…</option>
              {(products.data ?? []).map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} (stock: {p.stock_qty})</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-muted-foreground">Type</span>
            <select value={type} onChange={(e)=>setType(e.target.value as any)} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
              <option value="ajustement">Ajustement</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-muted-foreground">Quantité</span>
            <input type="number" value={qty} onChange={(e)=>setQty(e.target.value)} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10" />
          </label>
          <label className="text-sm">
            <span className="text-muted-foreground">Référence</span>
            <input value={ref} onChange={(e)=>setRef(e.target.value)} placeholder="BL, facture…" className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10" />
          </label>
          <label className="text-sm md:col-span-5">
            <span className="text-muted-foreground">Motif / description</span>
            <input value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="Ex : Livraison fournisseur X" className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10" />
          </label>
        </div>
        <button disabled={submit.isPending} onClick={()=>submit.mutate()} className="mt-4 rounded-lg gradient-brand px-5 py-2 font-medium text-white shadow-glow">
          {submit.isPending ? "…" : "Enregistrer"}
        </button>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-lg font-semibold">Historique</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr><th className="py-2 text-left">Date</th><th className="text-left">Produit</th><th className="text-left">Type</th><th className="text-right">Qté</th><th className="text-left">Motif</th></tr>
            </thead>
            <tbody>
              {(moves.data ?? []).map((m: any) => (
                <tr key={m.id} className="border-t border-white/5">
                  <td className="py-2 text-muted-foreground">{new Date(m.created_at).toLocaleString("fr-FR")}</td>
                  <td>{m.products?.name ?? "—"}</td>
                  <td><span className={`rounded-full px-2 py-0.5 text-xs ${m.move_type==='entree'?'bg-emerald-500/20 text-emerald-300':m.move_type==='sortie'?'bg-rose-500/20 text-rose-300':'bg-white/10'}`}>{m.move_type}</span></td>
                  <td className="text-right font-medium">{m.qty}</td>
                  <td className="text-muted-foreground">{m.reason ?? "—"}</td>
                </tr>
              ))}
              {(moves.data ?? []).length===0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Aucun mouvement.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
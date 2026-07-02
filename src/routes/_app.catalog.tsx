import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/_app/catalog")({ component: Catalog });

const COLORS = ["Noir","Blanc","Bleu","Rouge","Vert","Or","Argent","Rose","Violet","Gris"];
const RAMS = ["2 Go","3 Go","4 Go","6 Go","8 Go","12 Go","16 Go"];
const STORAGE = ["16 Go","32 Go","64 Go","128 Go","256 Go","512 Go","1 To"];
const CONDITIONS = [{v:"neuf",l:"Neuf"},{v:"reconditionne",l:"Reconditionné"},{v:"occasion",l:"Occasion"}];

function Catalog() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [brandId, setBrandId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [ram, setRam] = useState(""); const [storage, setStorage] = useState("");
  const [color, setColor] = useState(""); const [condition, setCondition] = useState("neuf");
  const [imei, setImei] = useState(""); const [pp, setPp] = useState(""); const [sp, setSp] = useState("");
  const [qty, setQty] = useState("1"); const [minStock, setMinStock] = useState("1");

  const brands = useQuery({ queryKey:["brands"], queryFn: async () => (await supabase.from("brands").select("*").order("name")).data ?? [] });
  const models = useQuery({
    queryKey:["models", brandId],
    enabled: !!brandId,
    queryFn: async () => (await supabase.from("phone_models").select("*").eq("brand_id", brandId).order("name")).data ?? [],
  });
  const products = useQuery({
    queryKey:["products", q],
    queryFn: async () => {
      let req = supabase.from("products").select("*, brands(name), phone_models(name)").order("updated_at", { ascending: false }).limit(200);
      if (q) req = req.ilike("name", `%${q}%`);
      return (await req).data ?? [];
    },
  });

  const brand = brands.data?.find((b: any) => b.id === brandId);
  const model = models.data?.find((m: any) => m.id === modelId);
  const autoName = useMemo(() => {
    return [brand?.name, model?.name, ram && `${ram} RAM`, storage, color, condition && CONDITIONS.find(c=>c.v===condition)?.l].filter(Boolean).join(" ");
  }, [brand, model, ram, storage, color, condition]);

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        name: autoName || "Produit",
        category: "phone",
        brand_id: brandId || null,
        model_id: modelId || null,
        storage: storage || null, ram: ram || null, color: color || null,
        condition: condition as any,
        imei: imei || null,
        purchase_price: Number(pp) || 0,
        sale_price: Number(sp) || 0,
        stock_qty: Number(qty) || 0,
        min_stock: Number(minStock) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produit ajouté");
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpenForm(false);
      setBrandId(""); setModelId(""); setRam(""); setStorage(""); setColor(""); setImei(""); setPp(""); setSp(""); setQty("1"); setMinStock("1");
    },
    onError: (e: any) => toast.error(e.message ?? "Erreur"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catalogue</h1>
          <p className="text-sm text-muted-foreground">Marques et modèles préconfigurés. Génération automatique du nom.</p>
        </div>
        <button onClick={() => setOpenForm(v => !v)} className="inline-flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 font-medium text-white shadow-glow">
          <Plus className="h-4 w-4" /> {openForm ? "Fermer" : "Ajouter un produit"}
        </button>
      </div>

      {openForm && (
        <div className="glass rounded-2xl p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <Select label="Marque" value={brandId} onChange={(v) => { setBrandId(v); setModelId(""); }} options={(brands.data ?? []).map((b: any) => ({v:b.id, l:b.name}))} />
            <Select label="Modèle" value={modelId} onChange={setModelId} options={(models.data ?? []).map((m: any) => ({v:m.id, l:m.name}))} />
            <Select label="État" value={condition} onChange={setCondition} options={CONDITIONS.map(c=>({v:c.v,l:c.l}))} />
            <Select label="RAM" value={ram} onChange={setRam} options={RAMS.map(x=>({v:x,l:x}))} />
            <Select label="Stockage" value={storage} onChange={setStorage} options={STORAGE.map(x=>({v:x,l:x}))} />
            <Select label="Couleur" value={color} onChange={setColor} options={COLORS.map(x=>({v:x,l:x}))} />
            <Input label="IMEI (optionnel)" value={imei} onChange={setImei} />
            <Input label="Prix d'achat (Ar)" value={pp} onChange={setPp} type="number" />
            <Input label="Prix de vente (Ar)" value={sp} onChange={setSp} type="number" />
            <Input label="Quantité initiale" value={qty} onChange={setQty} type="number" />
            <Input label="Stock minimum" value={minStock} onChange={setMinStock} type="number" />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Nom généré</span>
            <span className="font-medium">{autoName || "—"}</span>
          </div>
          <button disabled={create.isPending} onClick={() => create.mutate()} className="mt-4 rounded-lg gradient-brand px-5 py-2 font-medium text-white shadow-glow">
            {create.isPending ? "…" : "Enregistrer"}
          </button>
        </div>
      )}

      <div className="glass rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit…" className="w-full bg-transparent py-2 outline-none" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 text-left">Produit</th>
                <th className="text-left">IMEI</th>
                <th className="text-right">Achat</th>
                <th className="text-right">Vente</th>
                <th className="text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {(products.data ?? []).map((p: any) => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="py-2">{p.name}</td>
                  <td className="text-muted-foreground">{p.imei ?? "—"}</td>
                  <td className="text-right">{Number(p.purchase_price).toLocaleString("fr-FR")}</td>
                  <td className="text-right">{Number(p.sale_price).toLocaleString("fr-FR")}</td>
                  <td className={`text-right ${p.stock_qty <= p.min_stock ? "text-amber-400" : ""}`}>{p.stock_qty}</td>
                </tr>
              ))}
              {(products.data ?? []).length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Aucun produit.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: {v:string;l:string}[] }) {
  return (
    <label className="text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10 focus:ring-cyan-accent">
        <option value="">—</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}
function Input({ label, value, onChange, type="text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10 focus:ring-cyan-accent" />
    </label>
  );
}
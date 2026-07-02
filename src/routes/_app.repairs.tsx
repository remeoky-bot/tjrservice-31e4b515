import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/repairs")({ component: Repairs });

const STATUSES = [
  { v: "recu", l: "Reçu" }, { v: "diagnostic", l: "Diagnostic" }, { v: "devis", l: "Devis" },
  { v: "en_reparation", l: "En réparation" }, { v: "pret", l: "Prêt" },
  { v: "restitue", l: "Restitué" }, { v: "annule", l: "Annulé" },
];

function Repairs() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ customer_id:"", device_brand:"", device_model:"", imei:"", reported_issue:"", quote_amount:"" });
  const clients = useQuery({ queryKey:["clients"], queryFn: async () => (await supabase.from("customers").select("id,full_name").order("full_name")).data ?? [] });
  const list = useQuery({ queryKey:["repairs"], queryFn: async () => (await supabase.from("repairs").select("*, customers(full_name)").order("received_at",{ascending:false}).limit(100)).data ?? [] });

  const create = useMutation({
    mutationFn: async () => {
      if (!f.reported_issue) throw new Error("Panne signalée requise");
      const { error } = await supabase.from("repairs").insert({
        customer_id: f.customer_id || null,
        device_brand: f.device_brand || null, device_model: f.device_model || null,
        imei: f.imei || null, reported_issue: f.reported_issue,
        quote_amount: Number(f.quote_amount) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Fiche créée"); setOpen(false);
      setF({ customer_id:"", device_brand:"", device_model:"", imei:"", reported_issue:"", quote_amount:"" });
      qc.invalidateQueries({ queryKey:["repairs"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "pret") patch.ready_at = new Date().toISOString();
    if (status === "restitue") patch.delivered_at = new Date().toISOString();
    const { error } = await supabase.from("repairs").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Statut mis à jour"); qc.invalidateQueries({ queryKey:["repairs"] }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Réparations</h1>
          <p className="text-sm text-muted-foreground">Suivi des fiches de réparation par statut.</p>
        </div>
        <button onClick={()=>setOpen(v=>!v)} className="inline-flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 font-medium text-white shadow-glow"><Plus className="h-4 w-4" />{open?"Fermer":"Nouvelle fiche"}</button>
      </div>

      {open && (
        <div className="glass rounded-2xl p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-sm">
              <span className="text-muted-foreground">Client</span>
              <select value={f.customer_id} onChange={(e)=>setF({...f, customer_id:e.target.value})} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <option value="">—</option>
                {(clients.data ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </label>
            {(["device_brand","device_model","imei","quote_amount"] as const).map(k => (
              <label key={k} className="text-sm">
                <span className="text-muted-foreground">{k==="device_brand"?"Marque":k==="device_model"?"Modèle":k==="imei"?"IMEI":"Devis (Ar)"}</span>
                <input type={k==="quote_amount"?"number":"text"} value={(f as any)[k]} onChange={(e)=>setF({...f,[k]:e.target.value})} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10" />
              </label>
            ))}
            <label className="text-sm md:col-span-3">
              <span className="text-muted-foreground">Panne signalée</span>
              <textarea value={f.reported_issue} onChange={(e)=>setF({...f, reported_issue:e.target.value})} rows={3} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10" />
            </label>
          </div>
          <button onClick={()=>create.mutate()} disabled={create.isPending} className="mt-4 rounded-lg gradient-brand px-5 py-2 font-medium text-white shadow-glow">{create.isPending?"…":"Enregistrer"}</button>
        </div>
      )}

      <div className="glass rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground"><tr><th className="py-2 text-left">Réf</th><th className="text-left">Client</th><th className="text-left">Appareil</th><th className="text-left">Panne</th><th className="text-right">Devis</th><th className="text-left">Statut</th></tr></thead>
            <tbody>
              {(list.data ?? []).map((r: any) => (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="py-2 font-mono text-xs">{r.reference}</td>
                  <td>{r.customers?.full_name ?? "—"}</td>
                  <td>{[r.device_brand,r.device_model].filter(Boolean).join(" ") || "—"}</td>
                  <td className="max-w-[240px] truncate">{r.reported_issue}</td>
                  <td className="text-right">{Number(r.quote_amount||0).toLocaleString("fr-FR")}</td>
                  <td>
                    <select value={r.status} onChange={(e)=>updateStatus(r.id, e.target.value)} className="rounded bg-white/10 px-2 py-1 text-xs">
                      {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {(list.data ?? []).length===0 && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Aucune fiche.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
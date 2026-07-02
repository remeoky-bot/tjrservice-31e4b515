import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/clients")({ component: Clients });

function Clients() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ full_name:"", phone:"", email:"", address:"" });
  const list = useQuery({ queryKey:["customers"], queryFn: async () => (await supabase.from("customers").select("*").order("created_at",{ascending:false})).data ?? [] });
  const create = useMutation({
    mutationFn: async () => {
      if (!f.full_name) throw new Error("Nom requis");
      const { error } = await supabase.from("customers").insert(f as any); if (error) throw error;
    },
    onSuccess: () => { toast.success("Client ajouté"); setOpen(false); setF({full_name:"",phone:"",email:"",address:""}); qc.invalidateQueries({queryKey:["customers"]}); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Clients</h1><p className="text-sm text-muted-foreground">Base clients centralisée.</p></div>
        <button onClick={()=>setOpen(v=>!v)} className="inline-flex items-center gap-2 rounded-lg gradient-brand px-4 py-2 font-medium text-white shadow-glow"><Plus className="h-4 w-4" />{open?"Fermer":"Nouveau client"}</button>
      </div>
      {open && (
        <div className="glass rounded-2xl p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {(["full_name","phone","email","address"] as const).map(k => (
              <label key={k} className="text-sm">
                <span className="text-muted-foreground">{k==="full_name"?"Nom complet":k==="phone"?"Téléphone":k==="email"?"Email":"Adresse"}</span>
                <input value={(f as any)[k]} onChange={(e)=>setF({...f,[k]:e.target.value})} className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10" />
              </label>
            ))}
          </div>
          <button onClick={()=>create.mutate()} disabled={create.isPending} className="mt-4 rounded-lg gradient-brand px-5 py-2 font-medium text-white shadow-glow">{create.isPending?"…":"Enregistrer"}</button>
        </div>
      )}
      <div className="glass rounded-2xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground"><tr><th className="py-2 text-left">Nom</th><th className="text-left">Téléphone</th><th className="text-left">Email</th><th className="text-left">Adresse</th></tr></thead>
            <tbody>
              {(list.data ?? []).map((c: any) => (
                <tr key={c.id} className="border-t border-white/5"><td className="py-2">{c.full_name}</td><td>{c.phone ?? "—"}</td><td>{c.email ?? "—"}</td><td className="text-muted-foreground">{c.address ?? "—"}</td></tr>
              ))}
              {(list.data ?? []).length===0 && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Aucun client.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
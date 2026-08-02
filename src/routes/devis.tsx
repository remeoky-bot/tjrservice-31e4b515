import { createFileRoute } from "@tanstack/react-router";
import { useId, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { CheckCircle2, Send } from "lucide-react";
import { Layout } from "@/components/Layout";
import { contactInfo, services } from "@/lib/site-data";

const schema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(100),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  email: z.string().trim().email("Email invalide").max(255),
  service: z.string().min(1, "Choisissez un service"),
  budget: z.string().min(1, "Choisissez un budget"),
  description: z.string().trim().min(10, "Décrivez votre projet (10+ caractères)").max(2000),
});

const budgets = ["< 500 000 Ar", "500 000 – 2 000 000 Ar", "2 000 000 – 5 000 000 Ar", "5 000 000 Ar +", "À discuter"];

export const Route = createFileRoute("/devis")({
  head: () => ({
    meta: [
      { title: "Demander un devis gratuit – TJR Service" },
      { name: "description", content: "Recevez un devis personnalisé et gratuit pour votre projet web, mobile, design, maintenance, BTP ou électricité à Madagascar." },
      { property: "og:title", content: "Devis gratuit – TJR Service" },
      { property: "og:description", content: "Recevez votre devis personnalisé sous 24h." },
      { property: "og:url", content: "/devis" },
    ],
    links: [{ rel: "canonical", href: "/devis" }],
  }),
  component: DevisPage,
});

function DevisPage() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", service: "", budget: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const flat: Record<string, string> = {};
      r.error.issues.forEach((i) => { flat[i.path[0] as string] = i.message; });
      setErrors(flat);
      return;
    }
    setErrors({});
    const msg = `Bonjour TJR Service, je souhaite un devis.\n\nNom: ${form.name}\nEntreprise: ${form.company || "-"}\nTéléphone: ${form.phone}\nEmail: ${form.email}\nService: ${form.service}\nBudget: ${form.budget}\n\nDescription:\n${form.description}`;
    const url = `${contactInfo.whatsappLink}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Devis prêt à être envoyé sur WhatsApp !");
  };

  return (
    <Layout>
      <Toaster richColors position="top-right" />
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">Demande de devis</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Recevez votre <span className="text-gradient">devis gratuit</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Remplissez le formulaire — nous revenons vers vous sous 24h avec une proposition adaptée.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <aside className="space-y-4">
          {[
            "Devis 100% gratuit et sans engagement",
            "Réponse sous 24h ouvrées",
            "Conseil personnalisé selon vos besoins",
            "Tarification transparente",
            "Accompagnement de A à Z",
          ].map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-xl glass p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-accent" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </aside>

        <form onSubmit={submit} className="lg:col-span-2 rounded-2xl border border-white/10 bg-card p-6 shadow-card sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
            <Field label="Entreprise (optionnel)" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
            <Field label="Téléphone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
            <Select label="Service souhaité" value={form.service} onChange={(v) => setForm({ ...form, service: v })} options={services.map((s) => s.title)} error={errors.service} />
            <Select label="Budget estimatif" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} options={budgets} error={errors.budget} />
          </div>
          <div className="mt-4">
            <label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description du projet</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              maxLength={2000}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none focus:border-cyan-accent"
              placeholder="Parlez-nous de votre projet, vos objectifs, vos délais…"
            />
            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
          </div>

          <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow">
            Recevoir mon devis gratuit <Send className="h-4 w-4" />
          </button>
          <p className="mt-3 text-xs text-muted-foreground">En cliquant, votre demande sera transmise via WhatsApp.</p>
        </form>
      </section>
    </Layout>
  );
}

function Field({ label, value, onChange, error, type = "text" }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={255}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none focus:border-cyan-accent"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, error }: { label: string; value: string; onChange: (v: string) => void; options: string[]; error?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none focus:border-cyan-accent"
      >
        <option value="">Sélectionner…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
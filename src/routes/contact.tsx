import { createFileRoute } from "@tanstack/react-router";
import { useState, type ElementType, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Linkedin, ExternalLink, Send } from "lucide-react";
import { Layout } from "@/components/Layout";
import { contactInfo } from "@/lib/site-data";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  subject: z.string().trim().min(2, "Sujet requis").max(150),
  message: z.string().trim().min(10, "Message trop court").max(2000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact – TJR Service Antananarivo, Madagascar" },
      { name: "description", content: "Contactez TJR Service : téléphone, WhatsApp, email, Facebook et LinkedIn. Antananarivo, Madagascar." },
      { property: "og:title", content: "Contact – TJR Service" },
      { property: "og:description", content: "Joignez-nous pour vos projets web, mobile, design ou BTP." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const flat: Record<string, string> = {};
      r.error.issues.forEach((i) => { flat[i.path[0] as string] = i.message; });
      setErrors(flat);
      return;
    }
    setErrors({});
    const body = encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(form.subject)}&body=${body}`;
    toast.success("Ouverture de votre messagerie…");
  };

  return (
    <Layout>
      <Toaster richColors position="top-right" />
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">Contact</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Parlons de votre <span className="text-gradient">projet</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Une question, un devis, une collaboration ? Nous répondons sous 24h.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="space-y-5 lg:col-span-2">
          <InfoCard icon={Phone} title="Téléphone">
            {contactInfo.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:text-foreground">{p}</a>
            ))}
          </InfoCard>
          <InfoCard icon={MessageCircle} title="WhatsApp">
            <a href={contactInfo.whatsappLink} target="_blank" rel="noreferrer" className="hover:text-foreground">{contactInfo.whatsapp}</a>
          </InfoCard>
          <InfoCard icon={Mail} title="Email">
            <a href={`mailto:${contactInfo.email}`} className="hover:text-foreground">{contactInfo.email}</a>
          </InfoCard>
          <InfoCard icon={MapPin} title="Localisation">Antananarivo, Madagascar</InfoCard>
          <div className="flex gap-3 pt-2">
            <a href={contactInfo.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full glass hover:text-cyan-accent"><Facebook className="h-4 w-4" /></a>
            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full glass hover:text-cyan-accent"><Linkedin className="h-4 w-4" /></a>
            <a href={contactInfo.comeup} target="_blank" rel="noreferrer" aria-label="ComeUp" className="grid h-10 w-10 place-items-center rounded-full glass hover:text-cyan-accent"><ExternalLink className="h-4 w-4" /></a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 rounded-2xl border border-white/10 bg-card p-6 shadow-card sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Envoyez-nous un message</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Nom complet" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
          </div>
          <div className="mt-4">
            <Field label="Sujet" name="subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} error={errors.subject} />
          </div>
          <div className="mt-4">
            <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              maxLength={2000}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none focus:border-cyan-accent"
              placeholder="Décrivez votre besoin…"
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow">
            Envoyer le message <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </Layout>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: ElementType; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-card p-5 shadow-card">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-white shadow-glow">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="font-semibold">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, error }: { label: string; name: string; type?: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        id={name}
        name={name}
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
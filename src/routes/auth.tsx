import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Cpu } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Bienvenue !");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      nav({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur d'authentification");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/dashboard` });
    if ((res as any).error) toast.error((res as any).error.message ?? "Erreur Google");
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center gradient-hero px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-glow">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div className="text-lg font-bold">NEXEL <span className="text-cyan-accent">Manager Pro</span></div>
        </Link>
        <div className="glass rounded-2xl p-6 shadow-card">
          <h1 className="text-2xl font-bold">{mode === "signin" ? "Connexion" : "Créer un compte"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Accédez à votre espace." : "Le premier compte devient administrateur."}
          </p>

          <button onClick={google} disabled={busy}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 font-medium text-slate-900 hover:bg-white/90">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.4 29.4 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.9 0 19.5-8.7 19.5-19.5 0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.5 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13-5l-6-5.1c-1.9 1.4-4.4 2.2-7 2.2-5.3 0-9.8-3.1-11.3-7.5l-6.5 5C9.7 39 16.3 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2.2-2.1 4.1-3.8 5.4l6 5.1c-.4.4 6.5-4.8 6.5-14.5 0-1.2-.1-2.3-.4-3.5z"/></svg>
            Continuer avec Google
          </button>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-white/10" /> ou email <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet"
                className="w-full rounded-lg bg-white/5 px-3 py-2.5 outline-none ring-1 ring-white/10 focus:ring-cyan-accent" />
            )}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full rounded-lg bg-white/5 px-3 py-2.5 outline-none ring-1 ring-white/10 focus:ring-cyan-accent" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe"
              className="w-full rounded-lg bg-white/5 px-3 py-2.5 outline-none ring-1 ring-white/10 focus:ring-cyan-accent" />
            <button disabled={busy} className="w-full rounded-lg gradient-brand px-4 py-2.5 font-medium text-white shadow-glow">
              {busy ? "…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "Nouveau ? Créer un compte" : "J'ai déjà un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
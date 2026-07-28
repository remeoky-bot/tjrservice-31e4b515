import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Cpu } from "lucide-react";

type AuthorizationDetails = {
  client?: { name?: string; client_id?: string } | null;
  redirect_uri?: string | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
  scope?: string | null;
  scopes?: string[] | null;
};

type OAuthClient = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
};

function oauthClient(): OAuthClient {
  return (supabase.auth as unknown as { oauth: OAuthClient }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthClient().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="grid min-h-screen place-items-center gradient-hero px-4 text-foreground">
      <div className="glass max-w-md rounded-2xl p-6 text-sm">
        Impossible de charger cette demande d'autorisation : {String((error as Error)?.message ?? error)}
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? "Une application";
  const scopes = details?.scopes ?? (details?.scope ? details.scope.split(/\s+/).filter(Boolean) : []);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const client = oauthClient();
    const { data, error } = approve
      ? await client.approveAuthorization(authorization_id)
      : await client.denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("Le serveur d'autorisation n'a renvoyé aucune redirection."); return; }
    window.location.href = target;
  }

  return (
    <main className="grid min-h-screen place-items-center gradient-hero px-4 text-foreground">
      <div className="glass w-full max-w-md rounded-2xl p-6 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-glow">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div className="text-lg font-bold">NEXEL <span className="text-cyan-accent">Manager Pro</span></div>
        </div>
        <h1 className="text-xl font-bold">Autoriser {clientName} à accéder à votre compte ?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {clientName} pourra utiliser les outils NEXEL Manager Pro en votre nom. Vos permissions et les politiques de sécurité de l'application restent appliquées.
        </p>
        {scopes.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm">
            {scopes.map((s) => (
              <li key={s} className="rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10">{s}</li>
            ))}
          </ul>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex gap-2">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 rounded-lg gradient-brand px-4 py-2.5 font-medium text-white shadow-glow disabled:opacity-60"
          >
            {busy ? "…" : "Autoriser"}
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-60"
          >
            Refuser
          </button>
        </div>
      </div>
    </main>
  );
}
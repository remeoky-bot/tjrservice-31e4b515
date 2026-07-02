import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/settings")({ component: Settings });

function Settings() {
  const { user, roles } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <div className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Mon compte</h2>
        <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div><dt className="text-muted-foreground">Email</dt><dd>{user?.email}</dd></div>
          <div><dt className="text-muted-foreground">Rôles</dt><dd className="text-cyan-accent">{roles.join(", ") || "—"}</dd></div>
        </dl>
      </div>
      <div className="glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Boutique</h2>
        <p className="text-sm text-muted-foreground">Multi-boutique, devises et thermique 58/80mm — bientôt configurable ici.</p>
      </div>
    </div>
  );
}
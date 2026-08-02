# Revenir exactement au site TJR SERVICE publié

L'aperçu affiche aujourd'hui l'ERP « NEXEL Manager Pro ». Le site publié sur tjrservice.lovable.app est le site vitrine TJR SERVICE. J'ai retrouvé dans l'historique du projet la dernière version complète de ce site vitrine (juste avant la transformation en ERP) : elle contient la page d'accueil vitrine, l'en-tête, le pied de page, le bouton WhatsApp flottant, le sitemap et les fichiers SEO.

## Ce que je restaure (le vrai code TJR SERVICE)

- Page d'accueil vitrine complète : `src/routes/index.tsx`
- En-tête, pied de page, mise en page, bouton WhatsApp flottant
- Données du site (services, projets, contacts) : `src/lib/site-data.ts`
- Mise en page racine `__root.tsx` et thème/couleurs `src/styles.css` (bleu TJR SERVICE)
- `sitemap.xml`, `robots.txt`, `llms.txt`, `_redirects` (correctif 404 Netlify)
- Les images du site (logo, hero, projets) sont déjà présentes et conservées

## Ce que je supprime définitivement

- Toutes les pages de l'ERP NEXEL : tableau de bord, caisse, stock, catalogue, réparations, clients, réglages
- La page de connexion / inscription et le contexte d'authentification
- L'intégration agents MCP : route `/mcp`, page de consentement OAuth, manifeste, dossiers `[.mcp]` et `[.well-known]`, plugin MCP dans `vite.config.ts`, dépendance MCP
- Tout code TJR BTP Manager restant dans le projet

Ces éléments ne seront pas archivés ni réappliquables : suppression définitive, comme demandé.

## Points à savoir

- Le site en ligne n'est pas touché par ce nettoyage. Il reste tel quel jusqu'à ce que tu cliques sur Publier. Après validation, l'aperçu et le site publié seront identiques.
- Les tables créées en base (produits, ventes, réparations…) ne sont plus utilisées par le site vitrine. Je les laisse en place car les supprimer est irréversible ; dis-moi si tu veux aussi les effacer.
- Les vidéos et images promotionnelles générées sont des fichiers séparés déjà téléchargeables, elles ne font pas partie du code du site.

## Détails techniques

Restauration des fichiers depuis le commit précédant la suppression du site vitrine (`77ea72c^`) : `src/routes/index.tsx`, `src/routes/__root.tsx`, `src/routes/sitemap[.]xml.ts`, `src/components/{Header,Footer,Layout,WhatsAppFloat}.tsx`, `src/lib/site-data.ts`, `src/styles.css`, `public/{robots.txt,llms.txt,_redirects}`.
Suppression : `src/routes/_app*.tsx`, `src/routes/auth.tsx`, `src/routes/mcp.ts`, `src/routes/[.]lovable.oauth.consent.tsx`, `src/routes/[.mcp]`, `src/routes/[.well-known]`, `src/hooks/use-auth.tsx`, `.lovable/mcp/`, retrait de `mcpPlugin()` de `vite.config.ts` et de `@lovable.dev/mcp-js` de `package.json`. `src/routeTree.gen.ts` est régénéré automatiquement. Vérification finale par un build de production.

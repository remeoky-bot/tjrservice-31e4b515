# NEXEL Manager Pro — Plan de construction

Le cahier des charges décrit un logiciel complet type Odoo/Lightspeed/RepairDesk pour boutiques de téléphonie, informatique et réparation à Madagascar. Ce n'est pas un site vitrine : c'est une application de gestion complète (POS, stock, réparations, achats, clients, rapports, multi-boutiques, hors-ligne, impression tickets, catalogue intelligent).

Vu l'ampleur (27 pages, 18 chapitres, ~15 modules métier), je propose un **MVP web/PWA** livré en plusieurs itérations. La première itération remplace le site vitrine actuel par l'application NEXEL, avec les modules critiques opérationnels.

## Itération 1 — MVP fonctionnel (cette livraison)

**Auth & rôles**
- Lovable Cloud (Supabase) : email/mot de passe + Google
- Table `user_roles` (admin, gérant, vendeur, technicien, magasinier)
- Fonction `has_role()` SECURITY DEFINER
- Route gate `/_authenticated`

**Catalogue intelligent (Ch. 7)**
- Marques + modèles préchargés (iPhone, Samsung, Redmi, Tecno, Infinix, Itel, Oppo, Realme, Huawei, Honor)
- Attributs paramétrables : stockage, RAM, couleur, état (neuf/reconditionné)
- Génération auto du nom produit (ex. « iPhone 13 128 Go Noir Neuf »)
- Catégories accessoires (câbles, audio, stockage, informatique)
- Import/export Excel

**Point de vente / POS (6.1)**
- Recherche produit instantanée
- Panier, remises, multi-paiement (espèces, Mvola, Orange Money, Airtel Money)
- Impression ticket (format 58/80 mm via CSS print)
- Devise Ariary (Ar) sans décimales

**Stock (6.3)**
- Multi-boutiques, entrées/sorties tracées
- Alerte seuil bas, historique mouvements
- Inventaire

**Réparations (6.6)**
- Dépôt appareil (IMEI, diagnostic, devis)
- Statuts : Reçu → Diagnostic → Devis → En réparation → Prêt → Restitué
- Consommation pièces depuis stock
- Bon de dépôt / bon de restitution imprimables

**Clients & Fournisseurs**
- Fiche client (historique achats + réparations + garanties)
- Fournisseurs et bons de commande

**Tableau de bord & rapports (6.11)**
- CA jour/semaine/mois, marge, top produits, rotation
- Export Excel/PDF

**Design**
- Interface pro, dense, rapide au comptoir (raccourcis clavier)
- Palette bleu profond + accent doré (identité TJR)
- Responsive desktop / tablette / mobile

**Livrables**
- App déployée sur `tjrservice.lovable.app` (remplace le site vitrine actuel)
- ZIP code source complet + ZIP `dist/` prêt à héberger (Netlify), avec `_redirects` pour éviter 404
- Fichier HTML standalone de démonstration (mode « test hors serveur »)

## Itérations suivantes (non incluses ici)

2. Mode hors-ligne PWA (IndexedDB + sync différée)
3. Multi-boutiques avancé & consolidation
4. Notifications SMS clients (via passerelle)
5. Version Windows/Android native (Tauri / Capacitor)
6. Portail client public (suivi réparation)

## Questions bloquantes avant de commencer

1. **Remplacer le site TJR actuel** par NEXEL, ou créer NEXEL comme sous-section (`/app`) et garder le site vitrine ?
2. **Site vitrine actuel** (`tjrservice.lovable.app`) : à conserver ou à remplacer complètement ?

Réponds à ces 2 questions et je lance l'itération 1.

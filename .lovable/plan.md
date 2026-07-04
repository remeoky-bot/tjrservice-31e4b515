# Pub TJR SERVICE — Vidéo promotionnelle 2min30

## Concept narratif (5 actes)

**Acte 1 — La galère (0:00 → 0:30)**
Rakoto, jeune chef d'entreprise malgache, débordé dans son bureau : piles de cahiers, calculatrice, employés qui demandent des infos, téléphone qui sonne. Il se prend la tête. Voix off grave et empathique.

**Acte 2 — Le conseil (0:30 → 0:55)**
Café avec un ami entrepreneur souriant, tablette à la main. « Tu connais TJR SERVICE ? Ils digitalisent tout ça. » Contact affiché à l'écran.

**Acte 3 — La rencontre TJR (0:55 → 1:30)**
Équipe TJR (logo animé) en visio avec Rakoto. Analyse besoins → maquettes → développement. Écran qui se construit, code qui défile, dashboard qui prend vie.

**Acte 4 — La transformation (1:30 → 2:05)**
Livraison de l'app personnalisée. Rakoto sur son smartphone : stock, ventes, employés, rapports en temps réel. Ses employés heureux, magasin fluide.

**Acte 5 — La liberté (2:05 → 2:30)**
Rakoto sur la plage de Nosy Be, cocktail à la main, consulte son dashboard, sourit. Fondu sur logo TJR + contacts + tagline.

## Script voix off (français, ton chaleureux et pro)

1. « Diriger son entreprise ne devrait pas être un combat quotidien… »
2. « Stocks, ventes, employés, factures — tout à gérer, jamais assez de temps. »
3. « Et si la solution tenait dans votre poche ? »
4. « TJR SERVICE conçoit des applications de gestion sur mesure, pour votre entreprise, votre école, votre boutique. »
5. « Analyse, conception, développement — une équipe qui comprend votre réalité. »
6. « Aujourd'hui, Rakoto pilote son entreprise depuis n'importe où. En temps réel. En toute sérénité. »
7. « TJR SERVICE. Digitalisez. Simplifiez. Prospérez. »
8. « Contactez-nous : +261 34 79 333 70 — remeoky01@gmail.com »

## Production

**Visuels (photoréaliste IA — Gemini 3 Pro Image)**
- 10 images hero 1920×1080 : bureau chaotique, calculatrice/cahiers, café avec ami, écran tablette, équipe TJR en visio, wireframes, dashboard mobile, boutique fluide, plage Nosy Be, logo final
- Style cohérent : lumière chaude cinématique, personnages africains/malgaches, ambiance corporate premium

**Voix off**
- ElevenLabs TTS voix française grave (voice ID `onwK4e9ZLuTAKqWW03F9` Daniel ou `bIHbv24MWmeRgasZH58o` Will)
- 8 segments audio, request stitching pour prosodie fluide

**Musique**
- ElevenLabs Music : piano + montée orchestrale corporate, 2min30, ambiance Apple/inspirante

**Montage Remotion**
- 1920×1080 @ 30fps, ~4500 frames
- Effets Ken Burns (zoom/pan) sur images fixes → mouvement cinéma
- Sous-titres synchronisés VO
- Logo TJR animé en intro/outro
- Transitions : fade, wipe cinématiques
- Palette : bleu marine `#0A2540` + or `#D4AF37` + crème `#F5F0E6`
- Typo : Playfair Display (titres) + Inter (corps)

**Rendu**
- Split en 3 chunks (0-50s, 50-100s, 100-150s) pour respecter timeout 600s
- Concat ffmpeg → MP4 final dans `/mnt/documents/pub-tjr-service.mp4`

## Livrables
- `/mnt/documents/pub-tjr-service.mp4` — vidéo finale
- Sources Remotion versionnées sous `remotion/`
- Réutilisable / modifiable

## Note importante
Production complète : ~15-20 min de travail (génération images, TTS, musique, montage, 3 rendus). Je livre tout en une seule passe.
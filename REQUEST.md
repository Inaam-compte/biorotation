# REQUEST.md — Changements demandés pour Bio-Aliment

## 1. Renommage de l'application
- **Bio-Ration** → **Bio-Aliment** partout dans l'application
- Titre du site, sidebar, logo (BR → BA), dashboard, navbar mobile

### Fichiers concernés :
- `app/layout.tsx` — metadata title
- `components/Sidebar.tsx` — logo text "BioRation" → "Bio-Aliment", initiales "BR" → "BA"
- `app/(app)/dashboard/page.tsx` — toute référence "BioRation"
- `components/LandingNavbar.tsx` — si présent

---

## 2. Restructuration des catégories d'aliments

### Anciennes catégories :
| FR | AR |
|---|---|
| Fourrage grossier | علف خشن |
| Verdure | خضروات |
| Concentré | مركز |
| Correcteur | مصحح |
| Minéraux | معادن |
| Vitamines | فيتامينات |

### Nouvelles catégories :
| FR | AR |
|---|---|
| Matières premières | مواد أولية |
| Verdure | الأعلاف الخضراء |
| Sous-produits | مخلفات |
| Compléments | مكملات |
| Minéraux | معادن |

### Détail des changements :
- **Fourrage grossier** → fusionné dans **Matières premières**
- **Concentré** → renommé **Matières premières**
- **Verdure** → ar changé de "خضروات" à "الأعلاف الخضراء"
- **Correcteur** → renommé **Compléments** (ar: مكملات)
- **Vitamines** → supprimé
- **Nouveau : Sous-produits** (ar: مخلفات)
- **Minéraux** → inchangé

### Fichiers concernés :
- `components/aliments/AddAlimentModal.tsx` — tableau `categories`
- `prisma/seed.ts` — `category_fr` et `category_ar` de chaque aliment
- `components/aliments/AlimentsClient.tsx` — filtres par catégorie (si applicable)

---

## 3. Corrections des noms arabes des aliments (seed)

| Aliment (FR) | Ancien nom (AR) | Nouveau nom (AR) |
|---|---|---|
| Foin de luzerne | تبن البرسيم الحجازي | قرط الفصة |
| Foin d'avoine | تبن الشوفان | قرط الشوفان |
| Luzerne verte | البرسيم الحجازي الأخضر | الفصة |
| Ray-grass anglais | عشب الراي الإنجليزي | العبجور |
| Pulpe de betterave | لب البنجر | مخلفات اللفت السكري |
| Paille d'orge | قش الشعير | تبن الشعير |
| Paille de blé | قش القمح | تبن القمح |

### Fichier concerné :
- `prisma/seed.ts`

---

## 4. Modifications des aliments dans le seed

- **Supprimer** : CMV laitier (Correcteur)
- **Ajouter** : Carbonate de calcium (catégorie Minéraux)
- **Ajouter** : Sorgho fourrager / الذرة العلفية (catégorie Verdure)
- **Déplacer Pulpe de betterave** → catégorie Sous-produits

### Fichier concerné :
- `prisma/seed.ts`

---

## 5. Mise à jour du modal AddAliment

### 5a. Supprimer les flèches de spinner sur les inputs number
- Ajouter CSS pour cacher les spinners natifs des `<input type="number">`
- Appliquer dans `globals.css` ou en style inline

### 5b. Paramètres de composition
- Les champs UFV, EMv, ED lapins existent déjà ✅
- Le champ EE existe déjà ✅
- Vérifier qu'aucune référence "ME" subsiste (doit être EE)

### Fichiers concernés :
- `components/aliments/AddAlimentModal.tsx`
- `app/globals.css`

---

## 6. Passage complet en mode LIGHT (priorité haute)

### Principe :
Remplacer tous les fonds sombres par des fonds clairs, et adapter textes/bordures en conséquence.

### Mapping des couleurs :
| Dark (ancien) | Light (nouveau) |
|---|---|
| `bg-[#0f1117]` | `bg-gray-50` ou `bg-white` |
| `bg-[#14161e]` | `bg-white` (sidebar) |
| `bg-[#1a1d27]` | `bg-white` (cards) |
| `border-white/5` | `border-gray-200` |
| `border-white/10` | `border-gray-200` |
| `bg-white/5` | `bg-gray-50` |
| `bg-white/10` | `bg-gray-100` |
| `text-white` | `text-gray-900` |
| `text-gray-300` | `text-gray-700` |
| `text-gray-400` | `text-gray-500` |
| `text-gray-500` (dark ctx) | `text-gray-600` |
| `text-gray-600` (dark ctx) | `text-gray-500` |
| `shadow-black/20` | `shadow-sm` |
| `bg-green-500/10`, `/15`, `/20` | `bg-green-50` |
| `text-green-400` | `text-green-600` |

### Fichiers concernés (complet) :
1. `app/(app)/layout.tsx` — bg-[#0f1117] → bg-gray-50
2. `app/(app)/dashboard/page.tsx` — tous les dark colors
3. `components/Sidebar.tsx` — bg-[#14161e] → bg-white, textes
4. `components/aliments/AlimentsClient.tsx`
5. `components/animals/AnimalsClient.tsx`
6. `components/analytics/AnalyticsClient.tsx`
7. `components/reports/ReportsClient.tsx`
8. `components/supply/SupplyClient.tsx`
9. `components/settings/SettingsClient.tsx`
10. `app/(app)/tips/page.tsx`
11. `app/(app)/rationing/page.tsx`
12. `app/(app)/rationing/[animalId]/formulation/page.tsx`
13. `app/(app)/rationing/[animalId]/results/page.tsx`
14. `app/(app)/rationing/[animalId]/report/page.tsx`
15. `app/(app)/rationing/apports-alertes/page.tsx`

---

## Résumé des priorités

1. ⬜ Renommage Bio-Ration → Bio-Aliment
2. ⬜ Restructuration catégories (AddAlimentModal + seed)
3. ⬜ Corrections noms arabes (seed)
4. ⬜ Suppression CMV + Ajout Carbonate de calcium + Sorgho (seed)
5. ⬜ Suppression spinners number inputs
6. ⬜ Conversion complète LIGHT MODE
7. ⬜ Build & vérification

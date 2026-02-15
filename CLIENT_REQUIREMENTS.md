# 📋 Cahier des Charges — Client BioRation

> **Projet :** BioRation — Gestion des aliments en élevage biologique  
> **Date :** 15 Février 2026  
> **Version :** 1.0  
> **Statut :** En attente de validation

---

## Table des Matières

1. [Identité & Branding](#1--identité--branding)
2. [Refonte du Tableau de Bord](#2--refonte-du-tableau-de-bord)
3. [Réorganisation des Menus](#3--réorganisation-des-menus)
4. [Paramètres de Composition des Aliments](#4--paramètres-de-composition-des-aliments)
5. [Corrections Fonctionnelles](#5--corrections-fonctionnelles)
6. [Traduction FR / AR](#6--traduction-fr--ar)
7. [Module Gestion des Animaux (Différé)](#7--module-gestion-des-animaux-différé)
8. [État Actuel vs État Cible](#8--état-actuel-vs-état-cible)
9. [Plan d'Action Détaillé](#9--plan-daction-détaillé)

---

## 1. 🏷️ Identité & Branding

### Demande du client
Remplacer l'appellation **« Gestion Agricole »** par **« Gestion des aliments en élevage Bio »** partout dans l'application.

### État actuel
- La sidebar affiche : **"BioRation — Gestion Agricole"**
- Le titre HTML est : *"BioRation - Optimisation Nutritionnelle pour Élevage Bio"*

### Changements requis

| Emplacement | Actuel | Cible |
|---|---|---|
| Sidebar (desktop + mobile) | `BioRation - Gestion Agricole` | `BioRation - Gestion des aliments en élevage Bio` |
| Titre HTML (`<title>`) | `BioRation - Optimisation Nutritionnelle pour Élevage Bio` | `BioRation - Gestion des aliments en élevage Bio` |
| Toute autre occurrence | `Gestion Agricole` | `Gestion des aliments en élevage Bio` |

### Fichiers impactés
- `components/Sidebar.tsx`
- `app/layout.tsx` (metadata)

---

## 2. 🎯 Refonte du Tableau de Bord

### Demande du client
Remplacer le tableau de bord actuel (statistiques, alertes, actions rapides, animaux récents, conseils) par un **hub visuel central** avec :

- **Au centre :** Une forme (cercle, hexagone ou carte) contenant le logo/nom **« Bio Ration »**
- **En périphérie :** Des formes (cartes, cercles, hexagones) représentant les **menus principaux** du logiciel, disposées autour du centre

### Concept visuel

```
                    ┌───────────┐
                    │ ALIMENTS  │
                    └─────┬─────┘
                          │
         ┌────────┐  ┌────┴────┐  ┌──────────┐
         │ANIMAUX ├──┤   BIO   ├──┤ RATIONS  │
         └────────┘  │ RATION  │  └──────────┘
                     └────┬────┘
                          │
                    ┌─────┴──────┐
                    │ PARAMÈTRES │
                    └────────────┘
```

### Spécifications
- **Style :** Design moderne, organique, couleurs vertes/nature (bio)
- **Interactivité :** Chaque forme périphérique est cliquable et redirige vers le menu correspondant
- **Responsive :** Adaptation mobile (disposition en grille plutôt qu'en cercle)
- **4 menus principaux** visibles en périphérie :
  1. 🥬 **Aliments** → `/aliments`
  2. 🐄 **Animaux** → `/animals`
  3. 📊 **Rations** → `/rationing`
  4. ⚙️ **Paramètres** → `/settings`

### Fichiers impactés
- `app/(app)/dashboard/page.tsx` — Refonte complète

---

## 3. 📁 Réorganisation des Menus

### Demande du client
Réduire la navigation à **4 menus principaux** et intégrer les menus secondaires à l'intérieur de ceux-ci.

### Structure actuelle de la sidebar

```
├── Tableau de bord
├── Rationnement
├── Gestion des stocks
├── Aliments
├── Animaux
├── Analyses
├── Rapports
├── Mon Profil
├── Paramètres
└── (Tips — page existante mais absente du menu)
```

### Structure cible

```
├── Accueil (Hub central Bio Ration)
│
├── 🥬 Aliments
│   ├── Liste des aliments (page principale)
│   ├── Ajouter un aliment
│   └── Gestion des stocks ← (déplacé ici, ex-menu indépendant "Approvisionnement")
│
├── 🐄 Animaux
│   ├── Liste des animaux
│   └── Ajouter un animal
│
├── 📊 Rations
│   ├── Nouvelle ration / Rationnement
│   ├── Analyses ← (déplacé ici, ex-menu indépendant)
│   └── Rapports ← (déplacé ici, ex-menu indépendant)
│
└── ⚙️ Paramètres
    ├── Profil de la ferme
    ├── Langue et région
    └── Conseils journaliers ← (déplacé ici, ex-page Tips orpheline)
```

### Détail des déplacements

| Menu actuel | Nouveau parent | Justification |
|---|---|---|
| Gestion des stocks (`/supply`) | **Aliments** | Les stocks concernent les aliments |
| Analyses (`/analytics`) | **Rations** | Les analyses portent sur les rations |
| Rapports (`/reports`) | **Rations** | Les rapports concernent les rations |
| Conseils / Tips (`/tips`) | **Paramètres** | Contenu informatif, accessoire |
| Mon Profil (`/profile`) | **Paramètres** | Regroupement logique |

### Fichiers impactés
- `components/Sidebar.tsx` — Restructuration complète avec sous-menus dépliants
- Navigation dans toutes les pages (fil d'Ariane, boutons retour)

---

## 4. 🧪 Paramètres de Composition des Aliments

### Demande du client
Lors de la **création/modification d'un aliment**, le formulaire doit contenir **tous les paramètres de composition nutritionnelle** suivants :

### État actuel du formulaire (5 champs nutritionnels)

| Champ | Unité | Présent |
|---|---|---|
| MS (Matière sèche) | % | ✅ Oui |
| UFL | /kg MS | ✅ Oui |
| PDIE | g/kg MS | ✅ Oui |
| PDIN | g/kg MS | ✅ Oui |
| NDF | % /kg MS | ✅ Oui |

### État cible du formulaire (30 champs nutritionnels)

Le client demande **30 paramètres de composition**, organisés en groupes logiques :

#### Groupe 1 — Composition générale
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 1 | **MS** (Matière sèche) | % | ✅ Existe déjà |
| 2 | **MO** (Matière organique) | % Brut | 🆕 À ajouter |
| 3 | **MM** (Matière minérale) | % Brut | 🆕 À ajouter |

#### Groupe 2 — Matières azotées & lipides
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 4 | **MAT** (Matières azotées totales) | % Brut | 🆕 À ajouter |
| 5 | **EE** (Extrait éthéré / Lipides) | % Brut | 🆕 À ajouter |

#### Groupe 3 — Glucides & Fibres
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 6 | **Amidon** | % Brut | 🆕 À ajouter |
| 7 | **CB** (Cellulose brute) | % Brut | 🆕 À ajouter |
| 8 | **NDF** (Neutral Detergent Fiber) | % Brut | ✅ Existe (unité à vérifier) |
| 9 | **ADF** (Acid Detergent Fiber) | % Brut | 🆕 À ajouter |
| 10 | **ADL** (Acid Detergent Lignin) | % Brut | 🆕 À ajouter |

#### Groupe 4 — Minéraux
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 11 | **Ca** (Calcium) | g/kg Brut | 🆕 À ajouter |
| 12 | **P** (Phosphore) | g/kg Brut | 🆕 À ajouter |
| 13 | **Na** (Sodium) | g/kg Brut | 🆕 À ajouter |
| 14 | **Cl** (Chlore) | g/kg Brut | 🆕 À ajouter |

#### Groupe 5 — Valeurs énergétiques
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 15 | **UFL** (Unité Fourragère Lait) | /kg Brut | ✅ Existe (unité à corriger : Brut au lieu de MS) |
| 16 | **UFV** (Unité Fourragère Viande) | /kg Brut | 🆕 À ajouter |
| 17 | **Énergie nette (EN)** | Kcal/kg | 🆕 À ajouter |
| 18 | **UEL** (Unité d'Encombrement Lait) | Brut | 🆕 À ajouter |
| 19 | **UEB** (Unité d'Encombrement Bovin) | Brut | 🆕 À ajouter |

#### Groupe 6 — Valeurs protéiques
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 20 | **PDIE** (Protéines Digestibles — Énergie) | g/kg Brut | ✅ Existe (unité à corriger) |
| 21 | **PDIN** (Protéines Digestibles — Azote) | g/kg Brut | ✅ Existe (unité à corriger) |

#### Groupe 7 — Énergie métabolisable
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 22 | **EMv** (Énergie Métabolisable Volaille) | Kcal/kg Brut | 🆕 À ajouter |
| 23 | **ED lapins** (Énergie Digestible Lapins) | Kcal/kg Brut | 🆕 À ajouter |

#### Groupe 8 — Acides aminés
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 24 | **Lys** (Lysine) | % Brut | 🆕 À ajouter |
| 25 | **Méth** (Méthionine) | % Brut | 🆕 À ajouter |
| 26 | **Cys** (Cystéine) | % Brut | 🆕 À ajouter |
| 27 | **Thr** (Thréonine) | % Brut | 🆕 À ajouter |

#### Groupe 9 — Composés phénoliques (spécifique Bio)
| # | Paramètre | Unité | Statut |
|---|---|---|---|
| 28 | **Phénols totaux** | (à définir) | 🆕 À ajouter |
| 29 | **Flavonoïdes totaux** | (à définir) | 🆕 À ajouter |
| 30 | **Tannins totaux** | (à définir) | 🆕 À ajouter |
| 31 | **Tannins condensés** | (à définir) | 🆕 À ajouter |

> **Note :** Les unités des composés phénoliques (groupe 9) ne sont pas précisées par le client. Unités courantes : mg EAG/g MS (phénols), mg EQ/g MS (flavonoïdes), mg EC/g MS (tannins). **À confirmer avec le client.**

### Impact sur la base de données

Le modèle Prisma `Aliment` doit passer de **5 à 31 champs nutritionnels**. Cela nécessite :

1. **Migration Prisma** — Ajout de 26 nouvelles colonnes (toutes `Float?` — optionnelles)
2. **Mise à jour du formulaire** — `AddAlimentModal.tsx`
3. **Mise à jour de l'API** — `app/api/aliments/route.ts` et `app/api/aliments/[id]/route.ts`
4. **Mise à jour de l'affichage** — `AlimentsClient.tsx` (grille et tableau)
5. **Mise à jour du seed** — `prisma/seed.ts` (données par défaut)
6. **Mise à jour des calculs** — `lib/nutritional-calculations.ts`

### Fichiers impactés
- `prisma/schema.prisma` — Modèle `Aliment`
- `components/aliments/AddAlimentModal.tsx`
- `components/aliments/AlimentsClient.tsx`
- `app/api/aliments/route.ts`
- `app/api/aliments/[id]/route.ts`
- `prisma/seed.ts`

---

## 5. 🔧 Corrections Fonctionnelles

### 5.1 — Menus non fonctionnels dans « Gestion des aliments »

**Problème signalé :** Certains menus de la rubrique « Gestion des aliments » ne sont pas fonctionnels.

**Diagnostic :**

| Élément | Problème identifié |
|---|---|
| `AlimentsClient.tsx` | Interface entièrement en **anglais** au lieu du français |
| Boutons Edit/Delete sur les cartes aliment | Présents visuellement mais **sans gestionnaire d'événements** (non fonctionnels) |
| Filtres et tri | ✅ Fonctionnels |
| Ajout d'aliment (modal) | ✅ Fonctionnel |
| Affichage grille/tableau | ✅ Fonctionnel |

**Actions correctives :**
- Traduire toute l'interface `AlimentsClient.tsx` en français
- Implémenter les fonctions d'édition et de suppression des aliments
- Connecter les boutons Edit/Delete aux actions API correspondantes

### 5.2 — Fonction « Ajouter un animal » non fonctionnelle

**Problème signalé :** La fonction ajouter un animal ne fonctionne pas.

**Diagnostic :**
- Dans `AnimalsClient.tsx`, le bouton "Ajouter un animal" met `showAddModal` à `true`
- **Mais le composant `AddAnimalDialog` n'est pas rendu dans le JSX** — le modal ne s'affiche jamais
- Le composant `add-animal-dialog.tsx` existe et est fonctionnel (POST vers `/api/animals`)
- Les boutons "Voir détails" et "Calculer ration" n'ont **pas de liens/routes associés**
- Les boutons Edit (crayon) et Delete (corbeille) n'ont **aucun gestionnaire onClick**

**Actions correctives :**
- Importer et rendre `AddAnimalDialog` dans `AnimalsClient.tsx`
- Connecter les boutons "Voir détails" et "Calculer ration" aux routes appropriées
- Implémenter les fonctions d'édition et de suppression

---

## 6. 🌐 Traduction FR / AR

### Demande du client
Traduire tous les sous-menus et textes en anglais vers le **français**, et si possible en **arabe**.

### Diagnostic de l'état actuel

| Composant | Langue actuelle | Action requise |
|---|---|---|
| Sidebar | ✅ Français | Aucune |
| Dashboard | ✅ Français | Aucune |
| `AlimentsClient.tsx` | ⚠️ **Anglais** | ❌ **Traduction urgente** |
| `AddAlimentModal.tsx` | ✅ Français | Aucune |
| `AnimalsClient.tsx` | ✅ Français | Aucune |
| `AddAnimalDialog.tsx` | ✅ Français | Aucune |
| Rationnement | ✅ Français | Aucune |
| Supply (Stocks) | ✅ Français | Aucune |
| Analytics | ✅ Français | Aucune |
| Reports | ✅ Français | Aucune |
| Settings | ✅ Français | Aucune |
| Tips | ✅ Français | Aucune |

### Textes anglais identifiés dans `AlimentsClient.tsx` (priorité haute)

| Texte anglais actuel | Traduction française | Traduction arabe |
|---|---|---|
| Aliments Management | Gestion des aliments | إدارة الأعلاف |
| Manage your feed ingredients... | Gérez vos ingrédients alimentaires... | إدارة المكونات الغذائية... |
| Add New Aliment | Ajouter un aliment | إضافة علف جديد |
| Total Aliments | Total aliments | مجموع الأعلاف |
| Categories | Catégories | الفئات |
| Custom Aliments | Aliments personnalisés | أعلاف مخصصة |
| In Stock | En stock | متوفر |
| Search aliments... | Rechercher un aliment... | البحث عن علف... |
| All Categories | Toutes les catégories | كل الفئات |
| Sort by Name | Trier par nom | ترتيب بالاسم |
| Sort by Category | Trier par catégorie | ترتيب بالفئة |
| Sort by UFL | Trier par UFL | ترتيب حسب UFL |
| Grid / Table | Grille / Tableau | شبكة / جدول |
| Public / Custom | Public / Personnalisé | عام / مخصص |
| Low Stock | Stock faible | مخزون منخفض |
| No Stock | Hors stock | غير متوفر |
| Current Stock: | Stock actuel : | المخزون الحالي: |
| No aliments found | Aucun aliment trouvé | لم يتم العثور على أعلاف |
| Try adjusting your search... | Essayez de modifier vos critères... | حاول تعديل معايير البحث... |

### Système i18n (`next-intl`)
- Les fichiers `messages/fr.json` et `messages/ar.json` existent mais sont **très incomplets**
- Ils ne couvrent que les sections `landing`, `dashboard`, `auth`, et `common`
- **Recommandation :** Enrichir ces fichiers avec toutes les clés de traduction nécessaires, ou bien hard-coder le français comme langue principale et ajouter le support arabe progressivement

---

## 7. 🐄 Module Gestion des Animaux (Différé)

### Demande du client
> *"On peut laisser le module gestion des animaux pour plus tard"*

Le client a toutefois décrit la **structure cible** pour référence future :

### Architecture cible (3 niveaux)

```
Niveau 1 — Vue d'ensemble
├── Total animaux (compteur global)
├── Nombre par espèce (répartition)
└── [Bouton] Ajouter un animal

Niveau 2 — Filtrage par catégorie
├── Ovins et Caprins
├── Vaches laitières
└── Autres

Niveau 3 — Détails
└── Stade physiologique (Lactation, Gestation, Tarie, Croissance...)
```

### Espèces à supporter
- **Ovins** (moutons)
- **Caprins** (chèvres)
- **Vaches laitières**
- **Autres** (bovins à l'engrais, lapins, volailles — selon les espèces utilisées dans les calculs)

### Priorité
🟡 **Différé** — À implémenter dans une phase ultérieure. Cependant, le bug "Ajouter un animal" doit être corrigé maintenant (cf. section 5.2).

---

## 8. 📊 État Actuel vs État Cible

### Vue synthétique

| Fonctionnalité | État actuel | État cible | Priorité |
|---|---|---|---|
| Branding "Gestion Agricole" → "élevage Bio" | ❌ Ancien nom | ✅ Nouveau nom | 🔴 Haute |
| Dashboard → Hub central | ❌ Dashboard classique | ✅ Hub visuel avec menus | 🔴 Haute |
| 4 menus principaux | ❌ 9+ menus à plat | ✅ 4 menus avec sous-menus | 🔴 Haute |
| Stocks → sous-menu Aliments | ❌ Menu indépendant | ✅ Sous-menu d'Aliments | 🔴 Haute |
| Analyses + Rapports → sous-menu Rations | ❌ Menus indépendants | ✅ Sous-menus de Rations | 🔴 Haute |
| 30 paramètres nutritionnels | ❌ 5 paramètres | ✅ 30+ paramètres | 🔴 Haute |
| Traduction FR de AlimentsClient | ❌ En anglais | ✅ En français | 🔴 Haute |
| Bouton "Ajouter un animal" | ❌ Non fonctionnel | ✅ Fonctionnel | 🟠 Moyenne |
| Menus aliments non fonctionnels | ❌ Edit/Delete cassés | ✅ Fonctionnels | 🟠 Moyenne |
| Traduction arabe complète | ❌ Très incomplète | ✅ Complète | 🟡 Basse |
| Refonte gestion animaux (3 niveaux) | ❌ Interface basique | ✅ 3 niveaux | ⚪ Différé |

---

## 9. 🗓️ Plan d'Action Détaillé

### Phase 1 — Fondations (Priorité Haute)

| # | Tâche | Fichiers | Effort estimé |
|---|---|---|---|
| 1.1 | Renommer "Gestion Agricole" → "Gestion des aliments en élevage Bio" | `Sidebar.tsx`, `layout.tsx` | ⏱️ 15 min |
| 1.2 | Restructurer la sidebar (4 menus + sous-menus) | `Sidebar.tsx` | ⏱️ 2h |
| 1.3 | Créer le hub central (nouveau dashboard) | `dashboard/page.tsx` | ⏱️ 3h |
| 1.4 | Ajouter 26 champs au modèle `Aliment` + migration | `schema.prisma`, migration | ⏱️ 1h |
| 1.5 | Mettre à jour le formulaire d'ajout d'aliment | `AddAlimentModal.tsx` | ⏱️ 2h |
| 1.6 | Mettre à jour les API aliments | `route.ts`, `[id]/route.ts` | ⏱️ 1h |
| 1.7 | Mettre à jour l'affichage des aliments | `AlimentsClient.tsx` | ⏱️ 2h |

### Phase 2 — Corrections (Priorité Moyenne)

| # | Tâche | Fichiers | Effort estimé |
|---|---|---|---|
| 2.1 | Traduire `AlimentsClient.tsx` en français | `AlimentsClient.tsx` | ⏱️ 1h |
| 2.2 | Corriger "Ajouter un animal" (rendre le dialog) | `AnimalsClient.tsx` | ⏱️ 30 min |
| 2.3 | Implémenter Edit/Delete pour aliments | `AlimentsClient.tsx`, API | ⏱️ 2h |
| 2.4 | Connecter boutons animaux (détails, ration) | `AnimalsClient.tsx` | ⏱️ 1h |
| 2.5 | Mettre à jour le seed avec nouveaux champs | `seed.ts` | ⏱️ 1h |

### Phase 3 — Traduction (Priorité Basse)

| # | Tâche | Fichiers | Effort estimé |
|---|---|---|---|
| 3.1 | Compléter `messages/fr.json` | `fr.json` | ⏱️ 2h |
| 3.2 | Compléter `messages/ar.json` | `ar.json` | ⏱️ 3h |
| 3.3 | Intégrer `next-intl` dans tous les composants | Tous les composants | ⏱️ 4h |

### Phase 4 — Module Animaux (Différé)

| # | Tâche | Fichiers | Effort estimé |
|---|---|---|---|
| 4.1 | Refonte interface 3 niveaux | `AnimalsClient.tsx` | ⏱️ 4h |
| 4.2 | Ajout espèces Ovins/Caprins | `schema.prisma`, `add-animal-dialog.tsx` | ⏱️ 2h |
| 4.3 | Filtre par stade physiologique | `AnimalsClient.tsx` | ⏱️ 2h |

---

## 📎 Annexes

### A. Paramètres nutritionnels — Référence complète

Les paramètres demandés par le client couvrent les systèmes de nutrition animale français (INRA) :

| Abréviation | Nom complet | Description |
|---|---|---|
| MS | Matière Sèche | Pourcentage de matière après séchage |
| MO | Matière Organique | MS moins les cendres (minéraux) |
| MM | Matière Minérale | Cendres totales |
| MAT | Matières Azotées Totales | Protéines brutes (N × 6,25) |
| EE | Extrait Éthéré | Lipides / matières grasses |
| CB | Cellulose Brute | Fibres selon méthode Weende |
| NDF | Neutral Detergent Fiber | Fibres totales (hémicellulose + cellulose + lignine) |
| ADF | Acid Detergent Fiber | Cellulose + lignine |
| ADL | Acid Detergent Lignin | Lignine seule |
| UFL | Unité Fourragère Lait | Valeur énergétique pour la production laitière |
| UFV | Unité Fourragère Viande | Valeur énergétique pour l'engraissement |
| EN | Énergie Nette | Énergie utilisable par l'animal |
| UEL | Unité d'Encombrement Lait | Capacité d'ingestion (vaches laitières) |
| UEB | Unité d'Encombrement Bovin | Capacité d'ingestion (bovins viande) |
| PDIE | Protéines Dig. dans l'Intestin (Énergie) | PDI limitées par l'énergie fermentescible |
| PDIN | Protéines Dig. dans l'Intestin (Azote) | PDI limitées par l'azote dégradable |
| EMv | Énergie Métabolisable Volaille | Valeur énergétique pour volailles |
| ED lapins | Énergie Digestible Lapins | Valeur énergétique pour lapins |
| Lys | Lysine | Acide aminé essentiel |
| Méth | Méthionine | Acide aminé essentiel (soufré) |
| Cys | Cystéine | Acide aminé semi-essentiel (soufré) |
| Thr | Thréonine | Acide aminé essentiel |
| Ca | Calcium | Macro-minéral |
| P | Phosphore | Macro-minéral |
| Na | Sodium | Macro-minéral |
| Cl | Chlore | Macro-minéral |

### B. Points à clarifier avec le client

1. **Unités des composés phénoliques** — Quelle unité pour les phénols totaux, flavonoïdes, tannins totaux et tannins condensés ? (mg EAG/g ? mg EC/g ?)
2. **Unité de base** — Les valeurs doivent-elles être exprimées en **% Brut** (sur matière brute) comme demandé, ou en **% MS** (sur matière sèche) comme dans le système INRA classique ?
3. **Dashboard** — Le design exact du hub central (cercle, hexagone, grille ?) et les couleurs/animations souhaitées
4. **Espèces animaux** — La liste complète des espèces à inclure dans le module futur (ovins, caprins, bovins, lapins, volailles ?)
5. **Calcul de rations** — Les 26 nouveaux paramètres doivent-ils tous être utilisés dans les calculs de rationnement, ou seulement certains ?

---

> **Document généré le 15 Février 2026**  
> **Prochaine étape :** Validation client puis implémentation Phase 1

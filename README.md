<div align="center">

# 🌿 Bio-Aliment

**Plateforme d'optimisation nutritionnelle pour l'élevage biologique en Tunisie**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 À propos

Bio-Aliment est une application d'aide à la décision pour les éleveurs biologiques en Tunisie. Elle permet de :

- **Formuler des rations alimentaires** équilibrées selon les standards INRA
- **Gérer une base nutritionnelle** de 20+ aliments avec 30+ paramètres de composition
- **Suivre son troupeau** (bovins, ovins, caprins) et leur état physiologique
- **Calculer les besoins nutritionnels** (UFL, PDI, CI) en temps réel
- **Gérer les stocks** d'aliments et les fournisseurs
- **Recevoir des conseils** personnalisés basés sur le cheptel

L'interface est bilingue 🇫🇷 **Français** / 🇹🇳 **Arabe** pour les données d'aliments.

---

## 🖥️ Aperçu

| Dashboard | Aliments | Rationnement |
|---|---|---|
| Hub central avec statistiques, outils et conseils | Base nutritionnelle avec 30+ paramètres | Formulation de rations INRA |

---

## 🛠️ Stack Technique

| Couche | Technologie |
|---|---|
| Framework | **Next.js 15.5** (App Router) |
| UI | **React 19**, Tailwind CSS 4, Radix UI, Headless UI v2 |
| Langage | **TypeScript 5** |
| Base de données | **PostgreSQL** (Neon serverless) |
| ORM | **Prisma 6** |
| Validation | **Zod 4** |
| Icônes | Lucide React, Heroicons |
| i18n | next-intl |

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Une base PostgreSQL (ex: [Neon](https://neon.tech))

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/Ouederniamin/biorotation.git
cd biorotation

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env et ajouter votre DATABASE_URL

# 4. Générer le client Prisma
npx prisma generate

# 5. Appliquer les migrations
npx prisma migrate deploy

# 6. Peupler la base de données
npm run db:seed

# 7. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

---

## 📁 Structure du Projet

```
├── app/                        # Next.js App Router
│   ├── (app)/                  # Pages de l'application
│   │   ├── dashboard/          # Tableau de bord
│   │   ├── aliments/           # Gestion des aliments
│   │   ├── animals/            # Gestion du troupeau
│   │   ├── rationing/          # Formulation de rations
│   │   ├── analytics/          # Analyses nutritionnelles
│   │   ├── supply/             # Stocks & fournisseurs
│   │   ├── reports/            # Rapports
│   │   ├── tips/               # Conseils personnalisés
│   │   └── settings/           # Paramètres
│   └── api/                    # API REST (aliments, animals, stocks...)
├── components/                 # Composants React
│   ├── ui/                     # Primitives shadcn/ui
│   ├── aliments/               # Composants aliments
│   ├── animals/                # Composants animaux
│   ├── rationing/              # Composants rationnement
│   └── supply/                 # Composants stocks
├── lib/                        # Utilitaires
│   ├── nutritional-calculations.ts  # Moteur de calcul INRA
│   ├── prisma.ts               # Client Prisma singleton
│   └── auth-utils.ts           # Gestion utilisateur par défaut
├── prisma/                     # Schéma & migrations
│   ├── schema.prisma           # 10 modèles de données
│   └── seed.ts                 # Données initiales
├── ai-docs/                    # Documentation pour agents IA
└── messages/                   # Traductions (fr, ar)
```

---

## 🗄️ Base de Données

### Modèles Principaux

| Modèle | Description |
|---|---|
| **Aliment** | Ingrédient alimentaire bilingue (FR/AR) avec 30+ champs de composition |
| **Animal** | Animal d'élevage avec espèce, poids, phase physiologique |
| **Stock** | Inventaire par aliment avec seuils min/max |
| **Supplier** | Fournisseur d'aliments |
| **DailyTip** | Conseils d'élevage bilingues |

### Catégories d'Aliments

| Français | العربية |
|---|---|
| Matières premières | مواد أولية |
| Verdure | الأعلاف الخضراء |
| Sous-produits | مخلفات |
| Compléments | مكملات |
| Minéraux | معادن |

---

## 🧮 Calculs Nutritionnels

Le moteur de calcul (`lib/nutritional-calculations.ts`) implémente les formules INRA :

- **THI** — Indice Température-Humidité pour le stress thermique
- **CI** — Capacité d'Ingestion (kg MS) selon le poids, la production et la parité
- **UFL** — Unités Fourragères Lait (entretien + lactation + gestation)
- **PDI** — Protéines Digestibles dans l'Intestin (PDIE/PDIN)
- **Alertes** — Détection automatique des carences et excès

---

## 📜 Scripts Disponibles

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run start      # Serveur de production
npm run lint       # Vérification ESLint
npm run db:seed    # Peupler la base de données
```

### Commandes Prisma

```bash
npx prisma generate              # Régénérer le client
npx prisma migrate dev --name x  # Nouvelle migration
npx prisma migrate deploy        # Appliquer les migrations
npx prisma studio                # Interface graphique DB
```

---

## 🤖 Documentation IA

Le dossier [`ai-docs/`](ai-docs/) contient une documentation complète destinée aux agents IA travaillant sur le projet :

- **PROJECT.md** — Vue d'ensemble et stack technique
- **ARCHITECTURE.md** — Structure, flux de données, patterns
- **DATABASE.md** — Schéma, modèles, données de seed
- **API.md** — Référence complète des endpoints
- **UI.md** — Thème, composants, design system
- **CONVENTIONS.md** — Conventions de code et pièges courants

---

## 📄 Licence

Projet privé — Tous droits réservés.

---

<div align="center">
  <sub>Développé pour l'élevage biologique en Tunisie 🇹🇳</sub>
</div>

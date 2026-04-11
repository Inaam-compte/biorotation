# Architecture

## Directory Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata: "Bio-Aliment")
│   ├── page.tsx                  # Landing page (redirects to /dashboard)
│   ├── globals.css               # Global styles + number spinner removal
│   ├── (app)/                    # Authenticated app group (has Sidebar layout)
│   │   ├── layout.tsx            # App shell: Sidebar + main content area
│   │   ├── dashboard/page.tsx    # Main hub (server component, Prisma queries)
│   │   ├── aliments/page.tsx     # Feed ingredients management
│   │   ├── animals/page.tsx      # Herd management
│   │   ├── analytics/page.tsx    # Analytics dashboard
│   │   ├── reports/page.tsx      # Reports viewer
│   │   ├── settings/page.tsx     # App settings
│   │   ├── supply/page.tsx       # Stock & supplier management
│   │   ├── tips/page.tsx         # Personalized feeding tips
│   │   ├── profile/page.tsx      # User profile
│   │   └── rationing/            # Multi-step ration formulation
│   │       ├── page.tsx          # Animal selection for ration
│   │       ├── choix-espece/     # Species selection wizard
│   │       ├── formulation/      # Manual ration formulation
│   │       ├── apports-alertes/  # Nutrient intake alerts
│   │       └── [animalId]/       # Per-animal ration flow
│   │           ├── formulation/  # Formulate ration for specific animal
│   │           ├── results/      # Ration analysis results
│   │           └── report/       # Printable PDF-style report
│   ├── api/                      # API routes (all use DEFAULT_USER_ID)
│   │   ├── aliments/             # CRUD for feed ingredients
│   │   ├── animals/              # CRUD for animals
│   │   ├── stocks/               # Stock management
│   │   ├── stock-movements/      # Stock in/out tracking
│   │   ├── suppliers/            # Supplier management
│   │   └── user/profile/         # User profile endpoint
│   ├── sign-in/                  # Auth pages (non-functional, kept for routes)
│   ├── sign-up/
│   ├── forgot-password/
│   └── reset-password/
├── components/                   # React components
│   ├── Sidebar.tsx               # Main navigation sidebar (light theme)
│   ├── LandingNavbar.tsx         # Public landing page nav
│   ├── PrintButton.tsx           # Print utility
│   ├── add-animal-dialog.tsx     # Animal create/edit dialog
│   ├── aliments/                 # Aliment-specific components
│   │   ├── AddAlimentModal.tsx   # Add/edit aliment modal (Headless UI v2)
│   │   ├── AlimentsClient.tsx    # Aliments list with search/filter
│   │   └── index.ts              # Re-exports
│   ├── analytics/                # Analytics charts
│   ├── animals/                  # Animal list client component
│   ├── rationing/                # Ration formulation components
│   │   ├── AnimalSpeciesForm.tsx # Species/phase selection form
│   │   └── RationFormulation.tsx # Ration calculator widget
│   ├── reports/                  # Reports client component
│   ├── settings/                 # Settings client component
│   ├── supply/                   # Stock + supplier components
│   └── ui/                       # shadcn/ui primitives (Radix-based)
├── lib/                          # Shared utilities
│   ├── auth-utils.ts             # DEFAULT_USER_ID + getDefaultUser()
│   ├── nutritional-calculations.ts # INRA formulas (THI, CI, UFL, PDI)
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # cn() class merge utility
├── prisma/
│   ├── schema.prisma             # Database schema (10 models)
│   ├── seed.ts                   # Seed data (aliments + tips)
│   └── migrations/               # SQL migrations
├── messages/                     # i18n translation files
│   ├── fr.json                   # French translations
│   └── ar.json                   # Arabic translations
├── i18n/                         # next-intl config
│   └── request.ts
├── middleware.ts                  # Auth middleware (disabled, passes all)
└── public/                       # Static assets
```

## Data Flow Patterns

### Server Components (most pages)
```
page.tsx (Server Component)
  → prisma.model.findMany({ where: { userId: DEFAULT_USER_ID } })
  → renders HTML directly
  → passes data to Client Components as props
```

### Client Components (interactivity)
```
ClientComponent.tsx ('use client')
  → fetch('/api/...') for CRUD operations
  → useState/useEffect for local state
  → calls parent onSuccess() to trigger server re-render
```

### API Routes
```
app/api/[resource]/route.ts
  → const userId = DEFAULT_USER_ID  (no auth check)
  → Zod validation on request body
  → Prisma query
  → NextResponse.json()
```

## Routing Architecture

The app uses Next.js **route groups**:

- `(app)/` — All authenticated pages. Wrapped by `(app)/layout.tsx` which renders `<Sidebar />` + main content area.
- Root `app/layout.tsx` — Sets fonts, metadata, `<html lang="fr">`.
- `middleware.ts` — Passes all requests through (auth disabled).

## Component Architecture

### Page Pattern
Most pages follow: **Server page.tsx** → fetches data → renders a **Client component** for interactivity.

Example:
```
app/(app)/aliments/page.tsx (Server)
  → prisma.aliment.findMany(...)
  → groups by category_fr
  → <AlimentsClient initialAliments={grouped} categories={cats} />
```

### Modal Pattern (Headless UI v2)
```tsx
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

// NOT the v1 pattern: Dialog.Panel, Dialog.Title, Transition.Child
// Must use named exports: DialogPanel, DialogTitle, TransitionChild
```

### UI Components (shadcn/ui)
Located in `components/ui/`. Built on Radix UI primitives. Includes:
`alert-dialog`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `progress`, `select`, `table`, `tabs`

## Sidebar Navigation

```
Accueil          → /dashboard
Rationnement     → /rationing
  ├ Nouvelle ration → /rationing
  ├ Analyses        → /analytics
  └ Rapports        → /reports
Aliments         → /aliments
  ├ Base nutritionnelle → /aliments
  └ Gestion des stocks  → /supply
Mon Troupeau     → /animals
  └ Liste des animaux → /animals
Conseils         → /tips
Paramètres       → /settings
  ├ Général → /settings
  └ Profil  → /profile
```

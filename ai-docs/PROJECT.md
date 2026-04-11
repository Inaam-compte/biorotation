# Bio-Aliment — Project Overview

## What is Bio-Aliment?

Bio-Aliment is a **livestock feed management and nutritional optimization platform** designed for organic farming in Tunisia. It helps farmers formulate balanced animal rations, manage feed inventories, and track herd nutritional health — all based on INRA (Institut National de la Recherche Agronomique) standards.

**Primary language:** French (UI) + Arabic (aliment names, bilingual data)
**Target region:** Tunisia
**Domain:** Animal nutrition / Precision livestock feeding

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.5.12 |
| Runtime | React | 19.1.0 |
| Language | TypeScript | 5.x |
| Database | PostgreSQL (Neon serverless) | — |
| ORM | Prisma | 6.16.2 |
| Styling | Tailwind CSS | 4.x |
| UI Components | Radix UI, Headless UI v2, Lucide, Heroicons | — |
| Validation | Zod | 4.x |
| State | Zustand | 5.x |
| i18n | next-intl | 4.x |
| Auth | **Disabled** — single-user mode | — |
| Hosting | Not yet deployed | — |

## Key Design Decisions

1. **No authentication**: Auth was removed. All data belongs to a single default user (`DEFAULT_USER_ID = 'main-account-user-id'`). The auth models (Session, Account, Verification) remain in the schema but are unused.

2. **Light mode only**: The entire UI uses a clean light theme (white/gray-50 backgrounds, gray-900 text). No dark mode toggle exists.

3. **Bilingual data model**: Aliments (feed ingredients) have `name_fr`/`name_ar` and `category_fr`/`category_ar` fields. The UI is primarily French.

4. **INRA-based calculations**: All nutritional formulas (THI, CI, UFL, PDI, maintenance/lactation/gestation needs) follow INRA standards and are implemented in `lib/nutritional-calculations.ts`.

5. **Server-first architecture**: Most pages are React Server Components that fetch data directly via Prisma. Client components are used only for interactivity (forms, modals, filters).

## Repository

- **GitHub**: https://github.com/Ouederniamin/biorotation.git
- **Branch**: `main`
- **Local path**: `c:\Users\ngcadmin\Desktop\inaam`

## Running the Project

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database
npm run db:seed

# Start dev server
npm run dev

# Production build
npm run build && npm start
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (required) |

The `.env` file contains the database URL. No other env vars are needed since auth is disabled.

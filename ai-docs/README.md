# AI Documentation — Bio-Aliment

This folder contains comprehensive documentation for any AI agent working on the Bio-Aliment project. Read these files before making changes.

## Files

| File | What it covers |
|---|---|
| [PROJECT.md](PROJECT.md) | App overview, tech stack, design decisions, how to run |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Directory structure, data flow, routing, component patterns |
| [DATABASE.md](DATABASE.md) | Prisma schema, all models, aliment categories, seed data, field reference |
| [API.md](API.md) | Every API endpoint, request/response formats, validation |
| [UI.md](UI.md) | Theme colors, component library, layout system, key components |
| [CONVENTIONS.md](CONVENTIONS.md) | Naming rules, code patterns, common gotchas, build commands |

## Quick Reference

- **App name**: Bio-Aliment
- **Framework**: Next.js 15.5.12 + React 19 + TypeScript
- **Database**: PostgreSQL (Neon) via Prisma 6
- **Auth**: Disabled — single user `DEFAULT_USER_ID = 'main-account-user-id'`
- **Theme**: Light mode only (white/gray-50/green accents)
- **UI libs**: Headless UI **v2** (named exports, not compound), Radix/shadcn, Lucide, Heroicons
- **Categories**: Matières premières, Verdure, Sous-produits, Compléments, Minéraux
- **Repo**: https://github.com/Ouederniamin/biorotation.git (main branch)

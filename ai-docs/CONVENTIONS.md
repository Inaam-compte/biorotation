# Conventions, Rules & Gotchas

## Naming Conventions

### Files
| Type | Pattern | Example |
|---|---|---|
| Pages | `page.tsx` (Next.js convention) | `app/(app)/aliments/page.tsx` |
| Client components | PascalCase | `AlimentsClient.tsx`, `AddAlimentModal.tsx` |
| Server components | lowercase `page.tsx` or PascalCase | `page.tsx` |
| Utilities | camelCase | `auth-utils.ts`, `nutritional-calculations.ts` |
| UI primitives | lowercase | `button.tsx`, `card.tsx` |

### Variables
- French for user-facing strings: `"Ajouter un aliment"`, `"Matières premières"`
- English for code identifiers: `handleSubmit`, `formData`, `DEFAULT_USER_ID`
- Database fields use snake_case: `name_fr`, `ufl_per_kg_ms`, `category_ar`
- Component props use camelCase: `initialAliments`, `openAddOnLoad`

### Aliment Field Naming
Pattern: `{parameter}_{unit}_{basis}`
- `ms_percentage` — matière sèche, percentage, no basis needed
- `ufl_per_kg_ms` — UFL, per kg, matière sèche basis
- `pdie_g_per_kg_brut` — PDIE in grams, per kg, brut (raw matter) basis
- `emv_kcal_per_kg_brut` — EM volailles in kcal, per kg, brut basis
- `ca_g_per_kg_brut` — calcium in grams, per kg, brut basis

## Code Rules

### Authentication
- **Never** implement any auth checks. All routes pass through.
- **Always** use `DEFAULT_USER_ID` from `@/lib/auth-utils`.
- **Never** create new users or read user from session/token.

### Data Access
- Server components: use Prisma directly (`import { prisma } from '@/lib/prisma'`)
- Client components: use `fetch('/api/...')` to call API routes
- **Never** import Prisma in client components

### Component Patterns
- Mark client components with `'use client'` at the top
- Server components: no directive needed (default in App Router)
- Pass data from server to client via props, not context

### Imports
```tsx
// Prisma
import { prisma } from '@/lib/prisma'
import { DEFAULT_USER_ID } from '@/lib/auth-utils'

// UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Headless UI v2 (NOT v1 compound components)
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

// Icons
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'  // Heroicons
import { Plus, Trash2 } from 'lucide-react'                       // Lucide

// Utilities
import { cn } from '@/lib/utils'
```

### Error Handling
- API routes: try/catch with `console.error` + 500 response
- Client forms: `useState` for error state, display in red alert box
- No global error boundary configured

## Common Gotchas

### 1. Headless UI v2 API
The project uses `@headlessui/react` v2.2.8. **Do NOT use v1 patterns**:
```tsx
// WRONG — causes "a[d] is not a function" runtime error
<Transition.Child as={React.Fragment}>
<Dialog.Panel>
<Dialog.Title>

// CORRECT
<TransitionChild>
<DialogPanel>
<DialogTitle>
```

### 2. Tailwind CSS v4
Uses the new `@import "tailwindcss"` syntax, not `@tailwind base/components/utilities`. The `@theme inline` block defines CSS custom properties. Don't use `tailwind.config.js` — it doesn't exist.

### 3. React 19
The project runs React 19.1.0. Some older patterns may not work. Notably:
- `forwardRef` is optional in React 19
- `use()` hook is available
- Server components are the default in App Router

### 4. Prisma relationMode
`relationMode = "prisma"` is set in the schema. This means:
- Foreign key constraints are enforced at query time by Prisma, not the database
- Cascade deletes must be configured in the schema
- `@@index` is required on relation fields for performance

### 5. Zod v4
The project uses Zod v4 (`^4.1.9`), not v3. The API is mostly compatible but imports may differ for edge cases.

### 6. Category Names Changed
Old → New mapping (may exist in legacy DB data):
| Old | New |
|---|---|
| Fourrage grossier | Matières premières |
| Concentré | Matières premières |
| Correcteur | Compléments |
| Vitamines | (removed) |
| — | Sous-produits (new) |

### 7. Bilingual Data
Aliment categories require BOTH `category_fr` AND `category_ar`. When adding new categories to the `categories` array in `AddAlimentModal.tsx`, always provide both languages.

### 8. Settings Storage
Settings in `SettingsClient.tsx` use `localStorage` with key `'bioration_settings'` (legacy name kept for backward compatibility). Not persisted to database.

### 9. i18n Setup
`next-intl` is configured but translations are minimal (`messages/fr.json`, `messages/ar.json`). The UI is primarily hardcoded in French. The i18n setup exists for future expansion.

### 10. Print Support
The report page (`rationing/[animalId]/report/page.tsx`) has print-specific CSS classes (`print:...`). The `PrintButton` component triggers `window.print()`.

## Build & Deploy

```bash
# Dev
npm run dev           # Starts on localhost:3000

# Build (includes lint + type check)
npm run build         # Runs ESLint, TypeScript check, then builds

# Seed
npm run db:seed       # Idempotent — safe to run multiple times

# Prisma
npx prisma generate   # Regenerate client after schema changes
npx prisma migrate dev --name description  # Create new migration
npx prisma studio     # Open database GUI
```

## Known Warnings (non-blocking)

The build produces ESLint warnings for:
- Unused imports (several components have leftover imports)
- Unescaped `'` in JSX text (should use `&apos;`)
- `@typescript-eslint/no-explicit-any` in a few places
- Missing React Hook dependencies in some useEffect calls

These are cosmetic and don't affect functionality.

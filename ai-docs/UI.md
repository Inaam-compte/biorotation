# UI Components & Design System

## Theme

**Mode**: Light only (no dark mode)

### Color Palette
| Usage | Class |
|---|---|
| Page background | `bg-gray-50` |
| Card/panel background | `bg-white` |
| Sidebar background | `bg-white` with `border-r border-gray-200` |
| Primary text | `text-gray-900` |
| Secondary text | `text-gray-700` |
| Muted text | `text-gray-500` |
| Caption text | `text-gray-400` |
| Primary accent | `text-green-600`, `bg-green-600`, `bg-green-50` |
| Card borders | `border-gray-200` |
| Hover states | `hover:border-gray-300`, `hover:shadow-sm` |
| Active nav item | `bg-green-50 text-green-700` |

### Branding
- **App name**: "Bio-Aliment"
- **Logo initials**: "BA" (white text on green gradient background)
- **Logo gradient**: `bg-gradient-to-br from-green-500 to-green-600`

## Layout System

### App Shell (`app/(app)/layout.tsx`)
```
┌──────────────────────────────────────────────┐
│ [Sidebar 264px]  │  [Main Content Area]      │
│                  │  bg-gray-50, lg:pl-64      │
│  bg-white        │                            │
│  border-r        │                            │
│  border-gray-200 │                            │
└──────────────────────────────────────────────┘
```

### Mobile: Sidebar collapses into hamburger menu overlay.

## Component Library

### shadcn/ui (Radix-based) — `components/ui/`
Pre-built, styled with Tailwind. Import from `@/components/ui/[name]`.

| Component | File | Notes |
|---|---|---|
| Button | `button.tsx` | Variants: default, destructive, outline, secondary, ghost, link |
| Card | `card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Dialog | `dialog.tsx` | Radix-based dialog (used for animal dialog) |
| Badge | `badge.tsx` | Variants: default, secondary, destructive, outline |
| Input | `input.tsx` | Styled input |
| Label | `label.tsx` | Styled label |
| Select | `select.tsx` | Radix-based select dropdown |
| Table | `table.tsx` | Full table component set |
| Tabs | `tabs.tsx` | Tabbed navigation |
| AlertDialog | `alert-dialog.tsx` | Confirmation dialogs |
| DropdownMenu | `dropdown-menu.tsx` | Context menus |
| Progress | `progress.tsx` | Progress bar |

### Headless UI v2 Components
Used in `AddAlimentModal.tsx`. **Must use v2 named exports**:

```tsx
// CORRECT (v2)
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

// WRONG (v1 — will cause runtime errors)
// Dialog.Panel, Dialog.Title, Transition.Child, as={React.Fragment}
```

### Icon Libraries
1. **Heroicons** (`@heroicons/react/24/outline`): Used in Sidebar navigation
2. **Lucide** (`lucide-react`): Used in most page components

## Key Components

### Sidebar (`components/Sidebar.tsx`)
- Responsive: fixed sidebar on desktop, overlay on mobile
- Active state: green-50 background + green-700 text
- Expandable sub-menus with ChevronDown toggle
- Logo: "BA" green gradient + "Bio-Aliment" text

### Dashboard (`app/(app)/dashboard/page.tsx`)
- **Server component** — fetches data directly via Prisma
- Welcome banner with green gradient
- 4 tool cards (Rationnement, Aliments, Animaux, Conseils)
- 4 stat cards (Total animaux, En lactation, Aliments, Prod. moy.)
- Recent animals list
- Right sidebar: date widget, troupeau summary, tips, quick actions

### AlimentsClient (`components/aliments/AlimentsClient.tsx`)
- Client component receiving `initialAliments` (grouped by category) and `categories` array
- Features: search by name, filter by category, grid/table view toggle
- Edit/delete actions with confirmation dialogs
- Opens `AddAlimentModal` for create/edit

### AddAlimentModal (`components/aliments/AddAlimentModal.tsx`)
- Headless UI v2 Dialog with transitions
- Two-column layout: basic info (left) + nutritional values (right)
- 30+ composition fields rendered from `compositionFields` array
- Category select auto-fills both `category_fr` and `category_ar`
- Number inputs have **spinners removed** via CSS in globals.css

### AnimalsClient (`components/animals/AnimalsClient.tsx`)
- Client component for animal CRUD
- Supports `openAddOnLoad` prop (triggered by `?action=add` query param)
- Card-based layout showing species, phase, weight, production

### AddAnimalDialog (`components/add-animal-dialog.tsx`)
- Radix Dialog-based
- Species options: Vache laitière, Bovin à l'engrais, Ovin, Caprin
- Phase options: Lactation, Tarie, Gestation, Croissance
- Parity options: Primipare, Multipare, Tarie

### RationFormulation (`components/rationing/RationFormulation.tsx`)
- Complex client component for manual ration formulation
- Fetches available aliments, allows quantity selection
- Calculates nutritional totals vs. animal requirements
- Uses functions from `lib/nutritional-calculations.ts`

## CSS Conventions

### Number Input Spinners
Removed globally in `globals.css`:
```css
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
```

### Tailwind v4
Uses `@import "tailwindcss"` syntax (v4). Custom theme via `@theme inline` block in globals.css. Uses CSS custom properties for dynamic theming (oklch colors).

### Class Merging
Use `cn()` from `lib/utils.ts` (wraps `clsx` + `tailwind-merge`) for conditional classes:
```tsx
import { cn } from '@/lib/utils'
className={cn("base-class", condition && "conditional-class")}
```

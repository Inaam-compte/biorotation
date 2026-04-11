# Database Schema & Seed Data

## Provider

- **Database**: PostgreSQL on Neon (serverless)
- **ORM**: Prisma 6.x with `relationMode = "prisma"` (no foreign key constraints at DB level)
- **Connection**: via `DATABASE_URL` env var

## Models Overview

| Model | Purpose | Key Fields |
|---|---|---|
| **User** | Single default user | `id`, `email`, `name`, `phone`, `exploitantName`, `gouvernorat` |
| **Animal** | Livestock records | `species`, `weight`, `physiologicalPhase`, `parity`, `milkProduction` |
| **Aliment** | Feed ingredients (bilingual) | `name_fr`, `name_ar`, `category_fr`, `category_ar`, 30+ composition fields |
| **DailyTip** | Feeding/health tips (bilingual) | `title_fr`, `title_ar`, `content_fr`, `content_ar`, `category` |
| **Supplier** | Feed suppliers | `name`, `contact`, `email`, `phone`, `address` |
| **Stock** | Feed inventory per aliment | `alimentId`, `currentStock`, `minStock`, `maxStock`, `unitCost` |
| **StockMovement** | Stock in/out/adjustment log | `stockId`, `type`, `quantity`, `reason` |
| **PurchaseOrder** | Supplier orders | `supplierId`, `status`, `totalAmount`, `items[]` |
| **PurchaseOrderItem** | Line items in an order | `stockId`, `quantity`, `unitPrice` |
| **Session/Account/Verification** | Auth models (unused) | Kept in schema, never queried |

## Default User

All data belongs to:
```
ID: 'main-account-user-id'
Email: main@account.local
Name: Compte Principal
```
Set in `lib/auth-utils.ts` as `DEFAULT_USER_ID`.

## Aliment Model — Composition Fields

The Aliment model has **30+ nutritional composition fields**. These are grouped logically:

### Required fields (always set)
| Field | Description | Unit |
|---|---|---|
| `ms_percentage` | Matière sèche | % |
| `ufl_per_kg_ms` | Unité Fourragère Lait per kg MS | UFL |
| `pdie_per_kg_ms` | Protéines Digestibles (énergie) | g/kg MS |
| `pdin_per_kg_ms` | Protéines Digestibles (azote) | g/kg MS |
| `ndf_per_kg_ms` | Neutral Detergent Fiber | % MS |

### Proximate analysis (% brut)
`mo_percentage`, `mat_percentage`, `ee_percentage`, `amidon_percentage`, `cb_percentage`, `ndf_percentage_brut`, `adf_percentage`, `adl_percentage`, `mm_percentage`

### Minerals (g/kg brut)
`ca_g_per_kg_brut`, `p_g_per_kg_brut`, `na_g_per_kg_brut`, `cl_g_per_kg_brut`

### Energy values
`ufl_per_kg_brut`, `energie_nette_kcal_per_kg`, `ufv_per_kg_brut`, `uel_brut`, `ueb_brut`

### Protein values (g/kg brut)
`pdie_g_per_kg_brut`, `pdin_g_per_kg_brut`

### Multi-species energy
`emv_kcal_per_kg_brut` (EM volailles), `ed_lapins_kcal_per_kg_brut` (ED lapins)

### Amino acids (% brut)
`lys_percentage`, `meth_percentage`, `cys_percentage`, `thr_percentage`

### Phenolic compounds
`phenols_totaux`, `flavonoides_totaux`, `tannins_totaux`, `tannins_condenses`

## Aliment Categories

Current categories (as of latest update):

| French | Arabic | Description |
|---|---|---|
| Matières premières | مواد أولية | Raw materials (hay, straw, grains, oilseed meals) |
| Verdure | الأعلاف الخضراء | Green feeds (fresh forage) |
| Sous-produits | مخلفات | By-products (beet pulp, etc.) |
| Compléments | مكملات | Supplements (urea, bicarbonate) |
| Minéraux | معادن | Minerals (calcium carbonate) |

## Seed Data — Aliments

The seed file (`prisma/seed.ts`) populates these default aliments:

### Matières premières
| French | Arabic |
|---|---|
| Paille d'orge | تبن الشعير |
| Paille de blé | تبن القمح |
| Foin de luzerne | قرط الفصة |
| Foin d'avoine | قرط الشوفان |
| Ensilage de maïs | سيلاج الذرة |
| Orge | الشعير |
| Maïs grain | حبوب الذرة |
| Son de blé | نخالة القمح |
| Tourteau de soja | كسب فول الصويا |
| Tourteau de tournesol | كسب عباد الشمس |

### Verdure
| French | Arabic |
|---|---|
| Luzerne verte | الفصة |
| Trèfle violet | البرسيم البنفسجي |
| Ray-grass anglais | العبجور |
| Avoine verte | الشوفان الأخضر |
| Sorgho fourrager | الذرة العلفية |

### Sous-produits
| French | Arabic |
|---|---|
| Pulpe de betterave | مخلفات اللفت السكري |

### Compléments
| French | Arabic |
|---|---|
| Urée | اليوريا |
| Bicarbonate de sodium | بيكربونات الصوديوم |

### Minéraux
| French | Arabic |
|---|---|
| Carbonate de calcium | كربونات الكالسيوم |

## Seed Data — Daily Tips

8 tips covering: hydration, heat stress, feed transition, rumination, fiber optimization, metabolic disease prevention, pasture management, milking hygiene. Each has `title_fr`, `title_ar`, `content_fr`, `content_ar`, and a `category` (Santé, Bien-être, Alimentation).

## Extended Composition Calculation

The `withExtendedComposition()` function in `seed.ts` auto-generates the 30 optional fields from the 5 required fields using empirical formulas. This is used only for seeding — user-created aliments set all fields manually.

## Running Migrations & Seed

```bash
# Apply migrations
npx prisma migrate deploy

# Seed database (idempotent — upserts existing records)
npm run db:seed

# Reset and reseed
npx prisma migrate reset
```

## Important Notes for AI Agents

1. **Always use `DEFAULT_USER_ID`** when querying or creating data. Never create new users.
2. **Aliment IDs are CUIDs**, not integers. Always use string IDs.
3. **Category names changed** — if you see old names like "Fourrage grossier", "Concentré", "Correcteur" in the database, those are legacy records. New categories are: Matières premières, Verdure, Sous-produits, Compléments, Minéraux.
4. **Arabic names were corrected** — see the seed data table above for authoritative Arabic spellings.
5. **`isPublic: true`** = system-wide default aliment (no userId). `isPublic: false` with a userId = user-created custom aliment.

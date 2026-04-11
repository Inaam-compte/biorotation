# API Reference

All API routes are in `app/api/`. No authentication is required — every route uses `DEFAULT_USER_ID` from `lib/auth-utils.ts`.

## Aliments

### `GET /api/aliments`
Returns all aliments (public + user's custom), grouped by category.

**Query params**: none

**Response**: `200` — Array of aliments with optional stock data
```json
[{
  "id": "cuid...",
  "name_fr": "Orge",
  "name_ar": "الشعير",
  "category_fr": "Matières premières",
  "category_ar": "مواد أولية",
  "ms_percentage": 88.0,
  "ufl_per_kg_ms": 1.05,
  "pdie_per_kg_ms": 78,
  "pdin_per_kg_ms": 85,
  "ndf_per_kg_ms": 18.0,
  "isPublic": true,
  "stock": { "currentStock": 500, "minStock": 100, "maxStock": 2000 }
}]
```

### `POST /api/aliments`
Create a new aliment.

**Body**: Validated by Zod schema. Required: `name_fr`, `name_ar`, `category_fr`, `category_ar`, `ms_percentage`, `ufl_per_kg_ms`, `pdie_per_kg_ms`, `pdin_per_kg_ms`, `ndf_per_kg_ms`. All 30+ optional composition fields accepted.

**Response**: `201` — Created aliment object

### `GET /api/aliments/[id]`
Get a single aliment by ID.

### `PUT /api/aliments/[id]`
Update an aliment. Same body schema as POST.

### `DELETE /api/aliments/[id]`
Delete an aliment. Only user-owned aliments can be deleted (not public ones).

---

## Animals

### `GET /api/animals`
Returns all animals for the default user, ordered by `createdAt` desc.

### `POST /api/animals`
Create a new animal.

**Required body fields**:
- `species` (string): "Vache laitière", "Bovin à l'engrais", "Ovin", "Caprin"
- `weight` (number): Body weight in kg
- `physiologicalPhase` (string): "Lactation", "Tarie", "Gestation", "Croissance"
- `parity` (string): "Primipare", "Multipare", "Tarie"

**Optional fields**: `name`, `milkProduction`, `daysInLactation`, `daysInGestation`

### `GET /api/animals/[id]`
Get single animal.

### `PUT /api/animals/[id]`
Update an animal. Same fields as POST.

### `DELETE /api/animals/[id]`
Delete an animal.

---

## Stocks

### `GET /api/stocks`
Returns all stock records with aliment and supplier details, plus calculated status (good/low/critical).

### `POST /api/stocks`
Create a stock record for an aliment.

**Body**: `alimentId`, `currentStock`, `minStock`, `maxStock`, `unitCost`, `supplierId` (optional)

### `GET /api/stocks/[id]`
Get single stock with movement history.

### `PUT /api/stocks/[id]`
Update stock values.

### `DELETE /api/stocks/[id]`
Delete a stock record.

---

## Stock Movements

### `POST /api/stock-movements`
Record a stock movement (IN, OUT, or ADJUSTMENT).

**Body**:
- `stockId` (string)
- `type` ("IN" | "OUT" | "ADJUSTMENT")
- `quantity` (number): positive for IN, negative for OUT
- `reason` (string, optional)

---

## Suppliers

### `GET /api/suppliers`
Returns all suppliers with stock and order counts.

### `POST /api/suppliers`
Create a supplier.

**Body**: `name` (required), `contact`, `email`, `phone`, `address` (all optional)

---

## User Profile

### `GET /api/user/profile`
Returns the default user profile.

### `PUT /api/user/profile`
Update the default user's profile fields.

---

## Error Handling Pattern

All API routes follow this pattern:
```typescript
try {
  const userId = DEFAULT_USER_ID
  // ... validation & business logic
  return NextResponse.json(data, { status: 200 })
} catch (error) {
  console.error('Error:', error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
```

**Validation errors**: `400` with `{ error: "description" }`
**Not found**: `404` with `{ error: "Resource not found" }`
**Server errors**: `500` with `{ error: "Internal server error" }`

## Validation

Aliment routes use **Zod v4** for request body validation. The schema is defined inline in `app/api/aliments/route.ts`. All number fields validate `min(0)`, percentages validate `max(100)`.

Animal routes use manual validation (checking required fields).

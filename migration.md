# Gallery API Change: `month` → `date`

## What changed

The `GalleryImage` model field `month` (a plain string like `"June 2026"`) has been replaced with `date` (an ISO 8601 Date / timestamp). This allows proper chronological sorting and date-based queries.

## Before (old)

```json
{
  "id": "...",
  "month": "June 2026",
  "src": "...",
  "full": "...",
  "alt": "...",
  "caption": "...",
  "wide": false,
  "tall": false
}
```

## After (new)

```json
{
  "id": "...",
  "date": "2026-06-01T00:00:00.000Z",
  "src": "...",
  "full": "...",
  "alt": "...",
  "caption": "...",
  "wide": false,
  "tall": false
}
```

## Frontend changes required

| Location | Old code / assumption | New code |
|---|---|---|
| Reading the month label | `image.month` | Use `formatMonthLabel(new Date(image.date))` from `@/utils/slug` OR `new Date(image.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })` |
| Grouping by month | `groupBy(image => image.month)` | `groupBy(image => formatMonthLabel(new Date(image.date)))` |
| Sorting | Manual or relying on API | API now returns sorted by `date` descending |
| Creating / updating | Send `month: "June 2026"` | Send `date: "2026-06-01T00:00:00.000Z"` (or any valid ISO string) |

## Utility (already in the server repo)

```ts
// src/utils/slug.ts — you can copy this to the frontend
export const formatMonthLabel = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};
// "2026-06-01T00:00:00.000Z" → "June 2026"
```

## Migration

Existing documents in the database are migrated by running:

```bash
npx ts-node src/scripts/migrateGalleryMonth.ts
```

This parses the old `month` string into a `Date` (1st of that month), sets `date`, and removes `month`.

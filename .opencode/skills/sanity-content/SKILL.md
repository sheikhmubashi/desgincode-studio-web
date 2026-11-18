---
name: Sanity Content Changes
description: Add or change CMS-backed content in this project — Sanity schemas, GROQ queries, action types, and page wiring. Use for any field, document, singleton, or image change that starts in the Studio.
---

# Sanity content changes

The site is CMS-driven: Sanity schema → GROQ query in `src/actions/` → typed result → server
component. A change is only complete when all four layers agree.

## Data flow (never skip a layer)

```text
src/sanity/schemaTypes/<type>.ts   defineType/defineField  (Studio editing)
        ↓
src/sanity/structure.ts            sidebar + singleton document ID
        ↓
src/actions/get<Thing>.ts          defineQuery + sanityFetch + exported type
        ↓
src/app/(pages)/<route>/page.tsx   render with null-safe fallbacks
```

Supporting pieces:

- `src/sanity/lib/live.ts` — `sanityFetch` (Live Content API) and `<SanityLive />` in the
  root layout. Data is kept fresh by the live connection; there is no manual `revalidatePath`
  in this repo.
- `src/sanity/lib/image.ts` — `urlFor(source)` for image objects that include `asset`.
- `src/sanity/env.ts` — validates `NEXT_PUBLIC_SANITY_PROJECT_ID` / `..._DATASET`.

## Adding a field to an existing document

1. Add the `defineField` in `src/sanity/schemaTypes/<type>.ts` with name, title, type,
   validation, and `initialValue` when it is user-facing copy.
2. Project it in the matching query in `src/actions/`. Images need an explicit projection:
   - object image: `mainImage { asset, alt }` (then `urlFor(...)`)
   - dereferenced image: `heroImage { asset->{ url }, alt }` (then `asset.url`)
   - image dimensions: `asset->{ url, metadata{ dimensions{ width, height } } }`
3. Extend the exported TypeScript type next to the query. Preserve `null` for optional fields.
4. Render in the page with a fallback: `{data?.field ?? "Default"}` or a conditional block.
5. If the field is a new singleton, register it in **both** `schemaTypes/index.ts` and
   `structure.ts`, and add its document ID to the `SINGLETONS` array.

## Adding a new document type

- File: `src/sanity/schemaTypes/<name>.ts`, exported with the same name as the type.
- Import and add it to `schema.types` in `src/sanity/schemaTypes/index.ts`.
- Multi-document types appear automatically in the Studio via `documentTypeListItems()`.
  Singletons must be added to `structure.ts` or content editors will create duplicates.
- Create `src/actions/get<Name>.ts`; keep `defineQuery` at module scope (it is a compile-time
  helper and must not be called inside a component or conditionally).
- Prefer one singleton per page (`aboutPage`, `contactPage`, ...) over new document types for
  page-level copy; this dataset is page-oriented.

## Query rules

- Query singletons by ID as well as type: `*[_type == "aboutPage" && _id == "aboutPage"][0]`.
- Always handle missing content: `return data ?? null` or `return data ?? []`.
- Order lists explicitly (`| order(_createdAt desc)`), never rely on insert order.
- Keep the GROQ shape identical to the exported type. Nested projections are easy to get
  wrong — e.g. the project-by-slug query returns `{ project: ... }`, so callers must read
  `data.project`, not `data`.
- `slug.current` for slugs, `_key` for array items used as React keys.

## Images

- Sanity CDN is the only allowlisted remote host (`next.config.ts` → `cdn.sanity.io`). Adding
  another host requires a `remotePatterns` entry, not `images.domains` (removed in v16).
- Static assets live in `public/` and are referenced from `/`.
- Never bind `undefined` to `src`: guard with `data?.image?.asset?.url` or render `null`.
- Every image needs meaningful `alt`; array images should support an editor-provided `alt`
  field with a fallback to the project/member title.

## Write scripts

`scripts/*.mjs` mutate the live dataset, upload assets, and require `SANITY_API_TOKEN`.
They use `loadEnvConfig(process.cwd())`, fetch the document with `_rev`, and commit with
`ifRevisionId(...)`. Follow that pattern if a new script is truly needed, but:
**do not run, edit, or create them without explicit user approval**, and never echo the token.
Prefer making content changes through the Studio or a small reviewed script.

## Verify

```bash
npx tsc --noEmit
npm run lint
```

Then check the Studio (`/admin`) accepts the field and the route renders with both populated
and empty data. See `references/content-model.md` for the current document/field map.

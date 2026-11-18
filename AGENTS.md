<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DesginCode Studio — Agent Guide

Marketing website for an architecture and interior-design practice. Next.js App Router,
content managed in Sanity, deployed on Vercel. The brand is written both as "DesginCode"
(`desgincode.com`, metadata) and "Design Code Studio" (body copy); do not "fix" one into
the other unless asked.

## Stack (do not upgrade casually)

| Layer | Version / choice |
| --- | --- |
| Framework | Next.js `16.4.4`, App Router, Turbopack, React Compiler enabled |
| React | `19.2.3` |
| CMS | Sanity `4.x` embedded at `/admin`, `next-sanity` `11.x` with Live Content API |
| Styling | Tailwind CSS v4 (CSS-first, no `tailwind.config`), shadcn/ui (new-york), `tw-animate-css` |
| Motion | `framer-motion` `12.x` |
| Language | TypeScript strict, path alias `@/* → src/*` |

## Commands

```bash
npm run dev          # next dev (Turbopack)
npm run build        # next build (Turbopack)
npm run start        # next start
npm run lint         # eslint flat config — this is the only lint entry point
npx tsc --noEmit     # typecheck
```

`next lint` does not exist in Next 16. `next build` does not lint either, so run
`npm run lint` and `npx tsc --noEmit` yourself before declaring work done.

## Project map

```text
src/app/
  layout.tsx                 root layout: fonts, metadata, <SanityLive />
  page.tsx                   animated landing (/), client component
  navigation/page.tsx        full-screen menu (/navigation)
  design/page.tsx            legacy logo/Enter screen (/design)
  admin/[[...tool]]/page.tsx embedded Sanity Studio
  (pages)/                   shared MainHeader + Footer shell
    about-us | architecture | architecture/[slug] | interiors | news | people | contact-us
src/actions/                 server data fetchers (GROQ lives here, nowhere else)
src/sanity/
  env.ts                     env validation
  lib/{client,live,image}.ts client, sanityFetch/SanityLive, urlFor
  schemaTypes/               one file per document type
  structure.ts               Studio sidebar + singleton document IDs
src/components/
  ui/                        shadcn primitives (mostly unused)
  layout/Footer.tsx          CMS-driven footer
  MainHeader.tsx             header/nav (currently hardcoded)
  modules/scrambled.tsx      landing text animation
scripts/                     one-off Sanity write scripts (node --env-file style)
```

## Hard rules

1. **Read the bundled Next.js docs before using a framework API.** Start with
   `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` and the page
   for the feature you touch. Key v16 facts for this repo:
   - `params` and `searchParams` are Promises and must be awaited.
   - `middleware.ts` is now `proxy.ts` (Node runtime only) — none exists here today.
   - Turbopack is the default; do not add `--turbopack`, and do not add a `webpack` config.
   - `revalidateTag` requires a cache-life argument; `cacheLife`/`cacheTag` are stable.
   - React Compiler is on: do not hand-add `useMemo`/`useCallback` unless a profile proves it.
2. **Server Components are the default.** Add `"use client"` only for state, effects, or
   browser APIs, and push it down to the smallest leaf. Never import `scripts/`, the write
   token, or Node built-ins into a client component.
3. **All CMS reads go through `src/actions/*`.** Use `defineQuery` + `sanityFetch` from
   `@/sanity/lib/live`; return explicit types with `null`/`[]` defaults. Never write GROQ
   inline in a component or call `client.fetch` directly from a page.
4. **Type the data layer.** Return types are declared next to each query. Do not use `any`
   (lint warns on it) and do not mask query shapes with `as any`; if a query returns
   `{ project }`, type it as `{ project: ProjectDetail | null }`.
5. **Content is CMS-first with code fallbacks.** Every visible string/image should come from
   Sanity with a literal fallback (`data?.title ?? "About Us"`), because the dataset may be
   empty in preview/local.
6. **Follow the design system.** Container: `max-w-7xl mx-auto px-6 lg:px-12` (some pages use
   `px-4`). Typography: `heading-page` (Oswald semibold uppercase), `body-text`
   (Roboto Condensed 24/32), `nav-link`. Colors: text `#2E2E2E`, accent `#C3D6D4`.
   Use the CSS variables/tokens in `src/app/globals.css`, not new hex values.
7. **Images:** always `next/image`; Sanity-hosted only (`cdn.sanity.io` is allowlisted in
   `next.config.ts`). Use `urlFor(...)` for image objects and `asset->{ url }` projections
   for already-dereferenced assets. Every image needs `alt`; every `fill` needs a sized
   parent and `sizes`.
8. **Accessibility is part of done:** alt text, `title` on iframes, `aria-expanded` /
   `aria-controls` on the mobile menu, and no interactive element nested inside another
   (`<button>` inside `<Link>` is invalid).
9. **No debug output in committed code.** Remove `console.log` from pages and actions
   (two architecture routes currently have them).
10. **Do not run write scripts against the dataset without explicit approval.**
    `scripts/*.mjs` upload assets and patch live documents; they need `SANITY_API_TOKEN`.
    Never print, commit, or copy `.env.local` values.
11. **Keep diffs focused.** Do not reformat unrelated files, do not delete "unused" shadcn
    components or legacy routes, and do not rename published documents/fields without a
    migration path (queries and Studio document IDs depend on them).

## Content model rules

- Singleton document IDs equal the schema name: `navigation`, `footer`, `aboutPage`,
  `architecturePage`, `interiorsPage`, `peoplePage`, `contactPage`. Register new singletons
  in **both** `schemaTypes/index.ts` and `structure.ts`.
- Shared page data is normalized into the singleton document, not separate documents.
  `architecturePage.projects[]` and `interiorsPage.projects[]` are inline object arrays.
- Adding a field is a three-step change: schema field → query projection → action type →
  page render (skip nothing; a schema field with no projection silently renders nothing).
- `src/actions/getArchitecturePage.ts` is **not** an action — it is an orphaned duplicate
  schema with a `categories[]` shape that nothing imports. Do not extend it; edit
  `src/sanity/schemaTypes/architecturePage.ts` instead.

## Verification checklist

Before finishing any task:

```bash
npx tsc --noEmit
npm run lint
```

Then confirm the touched route renders (dev server) and, for data changes, that the query
projection matches the schema. Run `npm run build` when the change affects routing,
metadata, client boundaries, or config.

## Known gaps (verified 2026-11-14)

Treat these as existing debt, not as patterns to copy. Fix only when in scope.

- `MainHeader` ignores `getNavigation()` and uses `FALLBACK_NAV`; CMS nav edits have no effect.
- `Footer` maps a `twitter` platform to `/twitter_icon.svg`, which does not exist.
- `src/actions/getArchitecturePage.ts` is a misplaced, unused duplicate schema.
- `architecture/page.tsx` and `architecture/[slug]/page.tsx` contain `console.log` calls.
- `getProjectBySlug` is typed `ProjectDetail | null` but returns `{ project }`; callers use `any`.
- The architecture grid hardcodes up to 529px inline widths with no mobile fallback, so it can
  overflow narrow viewports; `interiors` already solves this with a stacked mobile layout.
- `FadeTransition` is only used by `/navigation` and `/design`, so it does not animate real
  page navigations.
- `/design` duplicates `/navigation` and the landing Enter button links to `/navigation`.
- Home page nests a `<button>` inside `<Link>` and leaves a `setTimeout` uncleaned.
- Contact iframe is missing a `title`; mobile menu button lacks `aria-expanded`.
- There is no test suite, CI workflow, or `sanity typegen`; route/query types are hand-written.

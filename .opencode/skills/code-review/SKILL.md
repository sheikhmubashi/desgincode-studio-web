---
name: code-review
description: Review a diff or the codebase for this Next.js 16 + Sanity site. Use before merging, when asked to review code, or to audit a page for correctness, accessibility, and performance.
---

# Code review

Review the change, not the whole repository, unless the user asks for a full audit. Report
findings ordered by severity with file:line references. Do not edit files during a review
unless asked; propose patches instead.

## Baseline gates

```bash
npx tsc --noEmit
npm run lint
```

Both must be clean. `npm run lint` warnings are not acceptable in new code (`no-explicit-any`
is a warning today; new `any` should be a review comment). Run `npm run build` when the diff
touches routes, metadata, config, or client/server boundaries.

## Checklist

### Next.js 16 correctness

- [ ] `params` / `searchParams` awaited; typed as `Promise<...>`.
- [ ] No `next lint`, no `--turbopack`, no webpack config, no deprecated `middleware`.
- [ ] New routes have `metadata` or `generateMetadata` (dynamic pages must await params).
- [ ] `"use client"` is on the smallest possible leaf; server-only code never crosses into it.
- [ ] Route handlers / caching APIs follow v16 signatures (`revalidateTag(tag, profile)`).
- [ ] React Compiler is enabled: flag hand-written `useMemo`/`useCallback` that only exist
      for memoization, and missing dependency arrays are still bugs.

### Server/client boundary

- [ ] No `SANITY_API_TOKEN`, `scripts/*`, `fs`, or write client imported into client code.
- [ ] No `console.log` left in pages or actions.
- [ ] Client components receive plain serializable props (no Sanity client, no functions).
- [ ] Effects clean up timers/listeners they create.

### Sanity data layer

- [ ] All GROQ lives in `src/actions/*`; pages do not import `client` or write queries.
- [ ] Query projection matches the schema (field names, dereferences, nested shapes).
- [ ] Return types match reality (`{ project }` vs `project` is the known bug).
- [ ] Null/empty handled; singletons queried by type **and** `_id`.
- [ ] New singleton registered in `schemaTypes/index.ts` and `structure.ts`.
- [ ] `defineQuery` at module scope, not inside a component.

### Rendering and images

- [ ] `next/image` used; no `<img>` (lint error).
- [ ] Every `fill` image has a positioned, sized parent and a `sizes` value.
- [ ] `src` is never `undefined`; guarded by `asset?.url` or a fallback.
- [ ] `alt` is meaningful; decorative images use `alt=""`.
- [ ] Remote hosts exist in `remotePatterns`; no `images.domains`.
- [ ] Layout does not rely on fixed pixel widths at mobile breakpoints.

### Design system

- [ ] Uses `heading-page` / `body-text` / `nav-link` and `#2E2E2E` / `#C3D6D4` tokens.
- [ ] Container `max-w-7xl mx-auto` with the same horizontal padding as sibling pages.
- [ ] No new arbitrary font sizes or colors when a token exists.
- [ ] Motion via `framer-motion` only in client components; no layout shift on load.

### Accessibility

- [ ] One `<h1>`; heading order is sane.
- [ ] No interactive element nested in another (`<button>` in `<Link>`, link in button).
- [ ] Iframes have `title`; inputs have labels; icon buttons have `aria-label`.
- [ ] Menu/toggle controls expose `aria-expanded` (and `aria-controls`).
- [ ] Keyboard focus is visible and not trapped by overlays.

### Security and data

- [ ] No secrets in code, logs, or client props; `.env.local` untouched.
- [ ] External URLs from CMS are rendered as `href`/`src` with no `javascript:` allowance
      beyond React's own handling; `target="_blank"` uses `rel="noopener noreferrer"`.
- [ ] Write scripts are guarded by `_rev` (`ifRevisionId`) and require explicit approval.

## Known issues to watch for (already present)

1. `MainHeader` ignores `getNavigation()`; CMS navigation does not work.
2. `Footer` references missing `/twitter_icon.svg`.
3. `src/actions/getArchitecturePage.ts` is an unused duplicate schema.
4. `getProjectBySlug` return type is wrong; callers paper over it with `any`.
5. Architecture grid can overflow on mobile (fixed widths).
6. `FadeTransition` does not wrap real navigations.
7. Landing page nests `<button>` inside `<Link>` and leaks a setTimeout.

Do not report these as new regressions unless the diff touches them; do flag them when a
change makes them worse.

## Output format

```text
Blocking
- src/app/.../page.tsx:42 — <problem>. <why it matters>. <suggested fix>.

Should fix
- ...

Nice to have
- ...

Verified
- tsc: clean; lint: clean; build: not run (reason).
```

If there are no findings, say so explicitly and list what you checked.

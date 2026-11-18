---
name: New CMS Page
description: Scaffold or restyle a public page in this Next.js 16 + Sanity site, matching the existing route-group shell, typography tokens, image rules, and responsive layouts.
---

# New CMS page

Use this when adding a public route, rebuilding a page, or converting a hardcoded section to
CMS-driven content.

## 1. Choose the route location

- Public pages live under `src/app/(pages)/<route>/page.tsx`. The `(pages)` group supplies
  `MainHeader` + `<main>` + `Footer` from `src/app/(pages)/layout.tsx`; do not add another
  header/footer.
- Standalone screens outside the shell (landing `/`, menu `/navigation`) live directly in
  `src/app/` and are client components.
- Dynamic pages: `src/app/(pages)/<section>/[slug]/page.tsx`, with
  `params: Promise<{ slug: string }>` and `const { slug } = await params`.

## 2. Server component skeleton

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { getThing } from "@/actions/getThing";

export const metadata: Metadata = {
  title: "Thing",
  description: "One sentence, plain language.",
};

export default async function ThingPage() {
  const data = await getThing();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
      <h1 className="heading-page text-2xl lg:text-5xl mb-6">
        {data?.pageTitle ?? "Thing"}
      </h1>
      {data?.body && (
        <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E]">{data.body}</p>
      )}
    </div>
  );
}
```

Rules:

- No `"use client"` on the page. Extract animated/stateful pieces into leaf components
  (`src/components/...`) that opt in themselves.
- Fetch through an action; never import the Sanity client into a page.
- Handle the empty dataset: render a neutral message (`No projects found.`) or nothing.
- `metadata` is static unless the page is dynamic; for `[slug]` use `generateMetadata`
  with awaited params. `title` inherits the `%s | DesginCode` template from the root layout.

## 3. Design tokens (already defined in `globals.css`)

| Token | Use |
| --- | --- |
| `.heading-page` | Page titles: Oswald 48/71, semibold, uppercase, black |
| `.heading-page text-2xl lg:text-5xl` | Responsive page titles (most pages use this) |
| `.body-text` | 24/32 Roboto Condensed, `#2E2E2E` |
| `.nav-link` | 30/45 Oswald bold uppercase |
| `font-heading` / `font-body` | Tailwind family utilities |
| `#2E2E2E` | Body text |
| `#C3D6D4` | Brand accent (landing background, hover) |
| `#7F7F7F` | Image placeholder background |

Container is `max-w-7xl mx-auto` with `px-6 lg:px-12` (interiors/news use `px-4`). Spacing is
usually `pt-10` + `pb-10`/`pb-20`; section gaps `mb-6`–`mb-16`.

## 4. Images and layout

- Use `next/image` with explicit `width`/`height` or `fill` inside a sized parent.
- Sanity sources: `urlFor(image).url()` for image objects, `asset.url` for dereferenced
  assets. Add `sizes` when using `fill`.
- Responsive pattern used by `interiors`: stacked full-width images below `xl`
  (`flex flex-col xl:hidden`), absolute collage at `xl` (`hidden xl:block` with a computed
  container height). Copy that pattern instead of hardcoded inline pixel widths on all
  breakpoints.
- Do not add new remote image hosts without a `remotePatterns` entry in `next.config.ts`.

## 5. Links and accessibility

- Internal links: `next/link`. Never `next/link` around a `<button>`; style the link itself.
- External links: `target="_blank"` + `rel="noopener noreferrer"`.
- Every image has `alt`; iframes need `title`; icon-only buttons need `aria-label`.
- Headings: one `<h1>` per page, then `<h2>` for sections.
- Mobile menu state must expose `aria-expanded` and `aria-controls`.

## 6. Verify

```bash
npx tsc --noEmit
npm run lint
npm run build   # for new routes / metadata / client boundaries
```

Open the route at mobile and desktop widths, and confirm the layout when the CMS returns
`null` (stop the dataset or temporarily pass empty data).

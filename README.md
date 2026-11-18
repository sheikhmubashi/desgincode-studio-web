# DesginCode Studio

Marketing site for an architecture and interior-design practice in Karachi. Built with
Next.js (App Router), Sanity CMS, Tailwind CSS v4, and Framer Motion.

## Stack

- **Next.js 16** (App Router, Turbopack, React Compiler) with React 19
- **Sanity 4** — content studio embedded at `/admin`, queried with `next-sanity`
  Live Content API (`sanityFetch` + `<SanityLive />`)
- **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`) + shadcn/ui primitives
- **Framer Motion** for the landing and transition animations

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Required | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | app + studio |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | app + studio |
| `NEXT_PUBLIC_SANITY_API_VERSION` | no (defaults to `2026-02-19`) | app + studio |
| `SANITY_API_TOKEN` | scripts only | `scripts/*.mjs` (write access) |
| `CLIENT_ASSETS_DIR` | no | `scripts/update-interiors-projects.mjs` |

Never commit `.env.local` or a `SANITY_API_TOKEN`.

## Scripts

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start (after build)
npm run lint     # eslint (flat config)
npx tsc --noEmit # typecheck
```

`scripts/*.mjs` are one-off content tools that upload assets and patch live Sanity documents.
They require `SANITY_API_TOKEN` and should only be run deliberately.

## Project structure

```text
src/
  app/
    layout.tsx               root layout, fonts, metadata, <SanityLive />
    page.tsx                 animated landing (/)
    navigation/page.tsx      full-screen menu (/navigation)
    design/page.tsx          legacy logo screen (/design)
    admin/[[...tool]]/       embedded Sanity Studio
    (pages)/                 header + footer shell for public pages
      about-us/ architecture/ architecture/[slug]/ interiors/
      news/ people/ contact-us/
  actions/                   server-side GROQ queries + result types
  sanity/
    env.ts                   validated env values
    lib/                     client, live fetch, image URL builder
    schemaTypes/             one schema file per document type
    structure.ts             Studio sidebar + singleton IDs
  components/
    ui/                      shadcn primitives
    layout/Footer.tsx        CMS-driven footer
    MainHeader.tsx           header + responsive navigation
    modules/scrambled.tsx    landing text animation
```

## Content editing

Open `/admin` and edit the singleton documents: Navigation, Footer, About Us, Architecture,
Interiors, People, Contact Us, plus News Posts. Page copy and images should be edited there,
not in the components; components keep literal fallbacks for an empty dataset.

## Notes

- `AGENTS.md` documents conventions and known issues for AI coding agents.
- `.opencode/skills/` contains project skills for Sanity changes, new pages, and reviews.
- Deployed on Vercel; `cdn.sanity.io` is the only allowlisted remote image host.

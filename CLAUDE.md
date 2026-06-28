# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Kilómetros por Explorar** — a Spanish-language static marketing/content site for a personalized travel-itinerary service (run by Lucas & Lucía). It does not sell packages; it guides independent travelers and publishes SEO travel guides. All UI copy and content is in Spanish.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `node_modules/.pnpm`).

```sh
pnpm dev           # Dev server at http://localhost:4321 (Astro default)
pnpm build         # Static build to dist/ — also runs content-collection + TS type checking
pnpm preview       # Serve the production build locally
pnpm format        # Prettier write across the repo
pnpm format:check  # Prettier check (CI-safe)
```

There is **no test runner and no linter** beyond Prettier. `pnpm build` is the de-facto correctness gate: it fails on Zod content-schema violations, broken `image()` references, and TypeScript errors. Run it before considering a change done.

## Tech Stack

- **Astro 6.x** (static output — all pages prerendered, no SSR, no API routes)
- **Preact** for the few interactive islands (`.tsx`), wired via `@astrojs/preact`
- **Tailwind CSS 4** via `@tailwindcss/vite` — **there is no `tailwind.config`**; the theme (fonts Onest/Blimone, primary `#12a3ed`) lives as CSS variables in `src/styles/global.css`. `@tailwindcss/typography` powers blog article styling (`src/styles/prose.css`).
- `@astrojs/sitemap` for sitemap generation
- `remark-github-blockquote-alert` for GitHub-style alert blockquotes in Markdown (configured in `astro.config.mjs`)

TypeScript is `astro/tsconfigs/strict`; path alias `@/*` → `src/*`; JSX is `react-jsx` with `jsxImportSource: preact`.

## Architecture

### Content Collections (the core of the site)

Schemas are defined in **`src/content.config.ts`** (note: project root `src/`, not `src/content/config.ts`). Three Zod-validated collections, all using the `glob` loader over `src/content/<collection>/`:

- **`blog`** (`src/content/blog/*.md`) — travel guides/articles. Fields: `title`, `description`, `date` (Date), `image`, `author` (string), `destinations` (string[] of destination ids), `faqs` (array of `{question, answer}` — **required**, rendered into FAQ schema and used for matching related articles).
- **`destinations`** (`src/content/destinations/*.md`) — destination overview pages. Fields: `name`, `country` (**required unless `category === 'sorpresa'`**, enforced by a `.refine`), `shortDescription`, `longDescription`, `image`, `category` (enum: `cultural | playa | naturaleza | ciudad | destacados | barco | sorpresa`), `featured`.
- **`customers`** (`src/content/customers/*.md`) — testimonials. Fields: `featured`, `title`, `name`, `image`, `destination` (`{name, href}`), `destinationFlagImage`, `metrics` (array of `{label, value}` — **exactly 4**), `description`, `metaDescription` (≤160 chars).

**Images are managed assets, not public files.** Every `image:` / `destinationFlagImage:` field uses Astro's `image()` schema helper, so frontmatter references **relative paths into `src/assets/`** (e.g. `image: '../../assets/images/blog/<slug>/cover.webp'`), and inline article images use the same relative form. Astro optimizes them at build. Do **not** point these at `/public`. (`public/` is reserved for a few raw assets like the brand logo referenced by absolute `/images/brand/...` URLs in schema/meta.)

### Routing

Pages live in `src/pages/`. Dynamic routes generate one static page per collection entry via `getStaticPaths()`:

- `blog/[slug].astro` → `/blog/<id-without-.md>`; also computes related articles (shared `destinations`), injects breadcrumb + Article + FAQ schema, and a client-side script that wraps article `<img>` in `<figure>` using alt text as caption.
- `destinos/[slug].astro` → `/destinos/<id>`
- `viajeros/[slug].astro` → `/viajeros/<id>` (customer testimonial pages)

The rest are static pages (`index`, `contacto`, `sobre-nosotros`, legal pages, `404`). `src/pages/llms.txt.ts` is an endpoint that emits `/llms.txt`.

### Layout & SEO pipeline

`src/layouts/Layout.astro` is the single shell: `<head>` via `MetaTags.astro`, then `Header`, page `<slot/>`, `CookieBanner` + `Chatbot` (both `client:idle`), `Footer`.

SEO/structured data is centralized in **`src/config/schemas.ts`** — typed builders returning Schema.org JSON-LD (`TravelAgency` org, `WebSite`, `WebPage`, `BlogPosting`/Article, `FAQPage`, `TouristDestination`, `Review`, `BreadcrumbList`). Pages combine them into a single `@graph`:

- `getCombinedSchema(pageSchema, ...extras)` for normal pages
- `getBlogCombinedSchema(article, breadcrumbs, faq)` for blog posts

Shared constants (domain, company contact, social links, default SEO copy) live in **`src/config/site.ts`**; URL helpers in `src/utils/getUrls.ts`. `astro.config.mjs` sets `site` and `trailingSlash: 'never'`.

### Astro vs Preact components

`.astro` components are static-rendered (layouts, cards, sections — the bulk of `src/components/`). Reserve Preact `.tsx` islands for genuine interactivity (`Chatbot.tsx`, `CookieBanner.tsx`) and hydrate them with the lightest directive that works (`client:idle`/`client:load`). The chatbot reads its webhook from `import.meta.env.PUBLIC_CHATBOT_WEBHOOK_ENDPOINT`.

## Conventions

- **Prettier** (`.prettierrc`): single quotes, semicolons, `trailingComma: es5`, 80-col, `arrowParens: avoid`, `.astro` files use the astro parser. `prettier-plugin-tailwindcss` auto-sorts class lists — don't hand-order them.
- **Internal links** in Markdown use root-relative paths: `/blog/<slug>`, `/destinos/<slug>`.
- Use `<Image>` from `astro:assets` for images (responsive `widths`/`sizes`, WebP).

# CLAUDE.md

## Project

**Kilómetros por Explorar** — a Spanish-language static marketing/content site for a personalized travel-itinerary service (run by Lucas & Lucía). It does not sell packages; it guides independent travelers and publishes SEO travel guides. All UI copy and content is in Spanish.

## Commands

Package manager is **pnpm**: `pnpm dev` / `build` / `preview` / `format`.

There is **no test runner and no linter** beyond Prettier. `pnpm build` is the de-facto correctness gate: it fails on Zod content-schema violations, broken `image()` references, and TypeScript errors. Run it before considering a change done.

Env vars live in an uncommitted `.env` — copy `.env.example` to create it:
`PUBLIC_CONTACT_FORM_ENDPOINT`, `PUBLIC_CHATBOT_WEBHOOK_ENDPOINT` (both `PUBLIC_`).
Both are declared in the `env.schema` of `astro.config.mjs` and read through
`astro:env/client`, **not** `import.meta.env` — so a missing one fails the build
instead of silently posting to `undefined`. Adding a var means editing that
schema, `.env.example` and `.env` together.

## Tech Stack

- **Tailwind CSS 4** — **there is no `tailwind.config`**; the theme (fonts Onest/Blimone, primary `#12a3ed`) lives as CSS variables in `src/styles/global.css`. `@tailwindcss/typography` powers article styling (`src/styles/prose.css`, imported by `blog/[slug]` and `viajeros/[slug]`).

### Markdown pipeline

`astro.config.mjs` sets `markdown.processor` to an explicit `unified()` instance, so adding a plugin means editing that call — the `remarkPlugins` key inside it belongs to `unified()`, not to Astro's `markdown.remarkPlugins`.

`rehypeToc` emits the `.toc-row` anchors that `blog/[slug].astro` reads at runtime to build the sticky side rail — renaming that class silently breaks the rail.

## Architecture

### Content Collections (the core of the site)

Three Zod-validated collections, all using the `glob` loader over `src/content/<collection>/`: **`blog`** (travel guides — the main search-traffic surface), **`destinations`** (destination pages, plus the `sorpresa` packs, which are products rather than real places), and **`customers`** (traveller testimonials).

**`src/content.config.ts` is the source of truth for every field — read it before writing or changing frontmatter.** Note the unusual location: project root `src/`, not `src/content/config.ts`.

Two things that file won't tell you:

- Several fields carry **exact counts** (`metrics`, `classicRouteElements`, `faqs`). Adding a required field, or tightening one, means updating **every existing entry in the same change** or the build fails.
- A `customers` body must contain a `>` blockquote: `viajeros/[slug].astro` uses it as the `Review` schema's `reviewBody`, and parses any metric whose label contains "valoraci" into `reviewRating`.

**Images are managed assets, not public files.** Every `image:` / `destinationFlagImage:` field uses Astro's `image()` schema helper, so frontmatter references **relative paths into `src/assets/`** (e.g. `image: '../../assets/images/blog/<slug>/cover.webp'`), and inline article images use the same relative form. Astro optimizes them at build. Do **not** point these at `/public`. (`public/` is reserved for a few raw assets like the brand logo referenced by absolute `/images/brand/...` URLs in schema/meta.)

`src/pages/llms.txt.ts` emits `/llms.txt` from all three collections, so it stays current automatically — no manual step when publishing.

### Layout & SEO pipeline

SEO/structured data is centralized in **`src/config/schemas.ts`** — typed builders for every Schema.org type the site emits. **Never hand-roll JSON-LD in a page; check there for a builder first.** Every page builds one `@graph` with `getCombinedSchema(pageSchema, ...extras)`, where `pageSchema` is always the `getWebPageSchema()` node.

Nodes are linked by stable `@id`, never by inlining a second copy of an entity: `ORGANIZATION_ID` / `WEBSITE_ID` for the site-wide nodes, and `getWebPageId(pathname)` (`<url>#webpage`) for the page itself, with the per-page entities at `#article` / `#faq` / `#review` / `#breadcrumb` / `#trip` / `#destination`. **A builder that needs to name the organization or the page emits `{ '@id': ORGANIZATION_ID }`, not an inline `Organization` object** — an unidentified duplicate dilutes the entity it was supposed to reinforce. `getWebPageSchema()` takes a final `hasBreadcrumb` flag so it only links `#breadcrumb` on pages that actually publish one.

`Review.itemReviewed` points at the `TouristTrip` of the destination the traveller visited, **never at our own business** — a self-serving review violates Google's structured-data policy. `getTripName()` is shared with `destinos/[slug]` so both pages name that trip identically and Google reconciles them as one entity.

`Breadcrumbs.astro` is presentational only: the page that renders it also owns the `BreadcrumbList` node in its own `@graph` (`blog/[slug]`, `destinos/[slug]` and `viajeros/[slug]` all do). Keep it that way — every page emits exactly one `<script type="application/ld+json">`, and a `#breadcrumb` node outside it is one the `WebPage` cannot reference.

Shared constants (domain, company contact, social links, default SEO copy) live in **`src/config/site.ts`**; URL helpers in `src/utils/getUrls.ts`; reading time in `src/utils/getReadingTime.ts`. The home-page FAQ lives in **`src/config/faqs.ts`** (`HOME_FAQS`) as the single source feeding both the `Faq` component and the `FAQPage` schema.

Every page `<title>` is built by `getPageTitle()` in **`src/utils/getPageTitle.ts`**, which appends the brand name from `site.ts`. Pass only the page-specific part — `getPageTitle('Blog')`, `getPageTitle(post.data.title)`, ``getPageTitle(`Viajar a ${name} a tu medida`)`` — and **never hardcode the `| Kilómetros por Explorar` suffix in a page**.

### Astro vs Preact components

`.astro` components are static-rendered (layouts, cards, sections — the bulk of `src/components/`). Reserve Preact `.tsx` islands for genuine interactivity (`Chatbot.tsx`, `CookieBanner.tsx`) and hydrate them with the lightest directive that works (`client:idle`/`client:load`).

Plenty of interactivity here is plain inline `<script>` in an `.astro` file rather than an island — the destination search/filter (`InteractiveDestinations.astro`), the mobile menu (`Header.astro`), the contact form submit, the article ToC rail. Follow that pattern for anything that only needs DOM wiring; don't reach for Preact.

`CookieBanner.tsx` is the consent gate for **Google Analytics** — it injects `gtag` only after the user accepts, storing the choice in `localStorage.cookieConsent`. The GA measurement id is hardcoded in that component, not in `site.ts`.

## Conventions

- **Prettier**: see `.prettierrc` for prettier conventions, `.astro` files use the astro parser. `prettier-plugin-tailwindcss` auto-sorts class lists (resolving the theme from `tailwindStylesheet: ./src/styles/global.css`) — don't hand-order them.
- **Internal links** in Markdown use root-relative paths: `/blog/<slug>`, `/destinos/<slug>`.
- Use `<Image>` from `astro:assets` for images (responsive `widths`/`sizes`, WebP).
- **All user-facing copy is in Spanish.** Code identifiers, commit messages and comments are English.

---
description: Real architectural review of this Astro site, grounded in the actual code
argument-hint: '[structure|content|rendering|seo|assets|maintainability]'
---

# Architecture Review

Act as a senior frontend architect specialized in Astro, static content sites, and technical SEO. Perform a REAL architectural review of this codebase based on the actual code — not generic best practices.

If `$ARGUMENTS` names a section (structure, content, rendering, seo, assets, maintainability), review ONLY that section. Otherwise, run all sections in the order below.

BEFORE YOU START:

- Read `CLAUDE.md` (repo root), then explore the actual files in each area before judging it — read the key modules, don't assume. There is no README.
- Treat the conventions documented in `CLAUDE.md` as ground truth. For each relevant one, assess whether the code adheres or has drifted, and call out drift explicitly.
- Do NOT recommend changes that contradict an intentional, documented convention (static output with no SSR, no `tailwind.config` — theme as CSS variables in `src/styles/global.css`, images as managed `src/assets/` references via the `image()` helper, centralized JSON-LD builders in `src/config/schemas.ts`, `.astro` by default with Preact reserved for real islands) unless you can show the convention itself causes a concrete problem.

RULES:

- No finding without a concrete reason and a reference to a real file/module. If you can't point to the exact file/pattern, don't claim it.
- If something is well-designed, say so — don't invent problems.
- Every criticism states: (1) the problem, (2) why it matters, (3) the real impact on maintenance or on search/user experience, (4) the simplest reasonable fix.
- Be pragmatic. This is a static marketing/content site run by two people, not an enterprise app. Calibrate severity accordingly and avoid overengineering.
- `pnpm build` is the only correctness gate (content-schema validation + TS). There is no test runner and no linter beyond Prettier — do not file findings that amount to "add a test suite" unless you can tie it to a concrete, recurring breakage.

PROJECT SHAPE:

- `src/content/{blog,destinations,customers}` → Markdown entries, Zod-validated by `src/content.config.ts`
- `src/pages` → static pages + `[slug].astro` dynamic routes via `getStaticPaths()`
- `src/components` → `.astro` components; `src/components/layout/{Chatbot,CookieBanner}.tsx` are the only Preact islands
- `src/config` → `site.ts` (constants), `schemas.ts` (JSON-LD builders), `faqs.ts`
- `src/layouts/Layout.astro` → the single shell; `MetaTags.astro` drives `<head>`
- Deployed static to Vercel (`vercel.json`), `trailingSlash: 'never'`

---

## 1. STRUCTURE

Scope: folder boundaries, where shared constants/helpers live (`src/config/`, `src/utils/getUrls.ts`), env/config management (`astro.config.mjs`, `PUBLIC_*` vars), duplication between config modules and content.
Red flags: constants duplicated instead of imported from `site.ts`, URL construction bypassing `getUrls.ts`, secrets in `PUBLIC_`-prefixed vars (these ship in the client bundle — flag anything sensitive there), structure that breaks down as the content set grows.

## 2. CONTENT MODEL — `src/content.config.ts` + `src/content/`

Scope: collection schema design, required vs optional fields, cross-collection references (`destinations: string[]` on blog entries pointing at destination ids), the `.refine` rules, whether the schema actually encodes the site's invariants.
Red flags: cross-collection references that aren't validated and can silently dangle, fields that are required but shouldn't be (or vice versa), schema drift between entries, data that lives in frontmatter but should be config (or vice versa), constraints enforced by convention in templates rather than by Zod.

## 3. RENDERING & COMPONENTS

Scope: the `.astro` vs Preact island split, hydration directives (`client:idle` / `client:load`), component boundaries and reuse across `src/components/`, `getStaticPaths()` work in the dynamic routes, the client-side script in `blog/[slug].astro` that wraps `<img>` in `<figure>`.
Red flags: a Preact island where a static component would do (or an island hydrated more eagerly than needed), duplicated markup that should be a shared component, per-page logic that belongs in the layout, expensive work repeated per page in `getStaticPaths()`.

## 4. SEO & STRUCTURED DATA

Scope: `src/config/schemas.ts` builders and the `@graph` composition (`getCombinedSchema` / `getBlogCombinedSchema`), `MetaTags.astro`, canonicals, breadcrumbs, sitemap config, `llms.txt.ts`.
Red flags: schema types or required properties that are wrong or missing per Schema.org, JSON-LD hand-built in a page instead of via a builder, canonical/OG URLs inconsistent with `trailingSlash: 'never'`, structured data that contradicts the visible page content, FAQ markup that doesn't match rendered FAQs.
This is a content/SEO business — weight findings here accordingly.

## 5. ASSETS & PERFORMANCE

Scope: image strategy (`<Image>` from `astro:assets`, `widths`/`sizes`, WebP), the `src/assets/` vs `public/` boundary, font loading, CSS strategy (`global.css`, `prose.css`), island JS cost.
Red flags: raw `<img>` where `<Image>` belongs, images in `public/` that should be managed assets, missing `widths`/`sizes` causing oversized downloads, layout shift, render-blocking or unused CSS/JS.
Classify each finding as: current problem, future risk, or premature optimization.

## 6. MAINTAINABILITY

Scope: consistency and readability, how hard it is to add a new article/destination/testimonial, whether `CLAUDE.md` still matches reality, type safety, formatting, deployment reproducibility.
Red flags: adding one piece of content requiring edits in many unrelated places, drift between code and `CLAUDE.md`, copy-paste between the three `[slug].astro` routes, `any`/loose typing around content entries.

---

OUTPUT FORMAT

Start with a 2–3 sentence overall assessment of the codebase's architectural health, then the sections.

For each section:

### [SECTION NAME]

✅ Good — what is genuinely well-designed and should not change.

⚠️ Could be improved — for each finding: Problem / Why it matters / Real impact / Recommended fix / Severity (Low|Medium|High).

Be concise and technical. Reference concrete files or modules. Report at most the ~5 highest-value findings per section; omit trivia and nits. Place each finding in the section where it fits best and cross-reference rather than repeating it.

## Priorities

The 3–5 highest-value improvements, ordered by impact, effort, and risk reduction. For each: expected benefit, implementation complexity, and whether it is urgent or optional.

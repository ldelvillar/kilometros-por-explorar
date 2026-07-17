---
description: Propose-first improvement pass for Kilómetros por Explorar — UI/UX polish, new features, and content strategy, grounded in the actual code
argument-hint: '[polish|features|strategy] (optional — defaults to all)'
---

# Improve

You are working on Kilómetros por Explorar, a Spanish-language static Astro site
for a personalized travel-itinerary service run by Lucas & Lucía. It does not
sell packages — it guides independent travelers and publishes SEO travel guides,
and the contact form / chatbot are the conversion points.
Read `CLAUDE.md` first and treat its conventions as binding.

Your job this session: make the site feel like a more professional, complete
product — through UI/UX polish, new user-facing features, and content strategy.
Work in two phases. Do NOT write or edit any code until I approve a plan.

If `$ARGUMENTS` names a focus (`polish`, `features`, or `strategy`), bias the
audit and plan toward it. Otherwise cover all three.

## PHASE 1 — Audit & propose (do this first, no code changes)

1. Explore the real site, don't assume:
   - Pages: walk `src/pages` — `index`, `/blog` and `blog/[slug]`, `/destinos`
     and `destinos/[slug]`, `/viajeros` and `viajeros/[slug]`, `contacto`,
     `sobre-nosotros`, the legal pages, and `404`.
   - Components: the home sections (`src/components/home/`), the card components
     per collection, `Layout.astro` / `Header` / `Footer` / `MetaTags`, and the
     two islands (`Chatbot.tsx`, `CookieBanner.tsx`).
   - Content: the three collections and their schemas in `src/content.config.ts`.
     Note what data already exists in frontmatter but isn't surfaced anywhere.

2. Evaluate it as a product, from a first-time visitor's eyes:
   - Where does it look unfinished, inconsistent, or untrustworthy? (Trust matters
     a lot when asking strangers to plan your trip — call out anything that
     undermines credibility.)
   - What obvious capability is missing that visitors would expect?
   - What's confusing in the discover → read a guide → trust them → contact
     journey? Is the path to conversion clear from every entry point, given most
     traffic lands on a blog article from search rather than on the home page?
   - Does anything read as generic filler rather than as Lucas & Lucía's own
     first-hand experience?

3. Produce a prioritized improvement plan as a table:
   | # | Improvement | Type (Polish/Feature/Strategy) | User impact | Effort (S/M/L) | Files touched | Risk |
   Order by impact-to-effort. Include a mix of quick wins and 1–2 bigger bets.
   For each item give 1–2 sentences of concrete detail (what it looks like / does),
   not vague labels like "improve UX".

4. Flag anything that needs my decision (design direction, scope, new deps) and
   ask before assuming. Surface tradeoffs instead of picking silently.

Then STOP and let me choose which items to build.

## PHASE 2 — Build (only what I approve)

For each approved item:

- Make surgical changes that trace directly to that item — no drive-by refactors,
  no speculative abstractions, match the surrounding code's style.
- All user-facing copy is in **Spanish** — match the existing tone and voice.
- Default to a static `.astro` component. Only reach for a Preact island if it
  needs real interactivity, and hydrate with the lightest directive that works.
- Use `<Image>` from `astro:assets` with responsive `widths`/`sizes`. New images
  are managed assets under `src/assets/` referenced relatively from frontmatter —
  never `/public`.
- Reuse the existing pieces: constants from `src/config/site.ts`, URLs via
  `src/utils/getUrls.ts`, JSON-LD via the builders in `src/config/schemas.ts`
  (never hand-roll structured data in a page).
- If a change needs a new content field, add it to the Zod schema in
  `src/content.config.ts` and update every existing entry — a missing required
  field fails the build.
- Don't hand-order Tailwind classes; `prettier-plugin-tailwindcss` sorts them.
- Keep it responsive and accessible (labels, focus, contrast, semantics).
- Protect the SEO surface: preserve canonicals, breadcrumbs, and structured data,
  and don't change a published URL without saying so — these pages rank.
- Verify before claiming done: run `pnpm build` (the real gate — it catches
  content-schema violations, broken `image()` references, and TS errors) and
  check the page in `pnpm dev`. Report actual results — if something fails or you
  skipped a check, say so.

Work one item at a time, show me the diff intent, and pause between items so I can
steer. Prefer a few well-finished improvements over many half-done ones.

---
description: Write a conventional commit message for the staged changes
---

# Commit

Analyze the staged changes and write a conventional commit message for the Kilómetros por Explorar project.

## Instructions

1. Run `git diff --staged` to review what's staged.
2. If nothing is staged, run `git diff HEAD` to check unstaged changes, then tell the user to stage what they want committed and stop.
3. Identify the **primary intent** of the changes — don't describe every file touched, describe what the change accomplishes.
4. Write a commit message following the format below.
5. Run `git commit -m "<message>"` — do not ask for confirmation unless the changes are ambiguous or span multiple unrelated concerns (in which case, flag this and suggest splitting).

## Commit Message Format

For a simple, short, or single-concern change, write a **title only** — no body, no bullets:

```text
<type>(<scope>): <short description>
```

Only add a body when the title genuinely can't carry the substance (multiple
non-obvious changes, or context the diff won't reveal):

```text
<type>(<scope>): <short description>

- <bullet 1>
- <bullet 2>
- <bullet 3>
```

When you do add a body, use **short bullet points** (≤3, each a single line).
Do **not** write prose paragraphs explaining motivation at length; the title
names the intent, the bullets name what changed. When in doubt, prefer a
title-only commit.

**Types** (full Conventional Commits / Angular set):

- `feat` — new feature or behaviour
- `fix` — bug fix
- `perf` — performance improvement with no behaviour change
- `refactor` — restructuring with no behaviour change
- `build` — build system or external dependencies (`pnpm-lock.yaml`, `astro.config.mjs`)
- `chore` — tooling or maintenance that doesn't fit another type
- `style` — formatting only (Prettier)
- `docs` — documentation only
- `revert` — reverts a previous commit

**Scopes for this project** (these are the scopes already in use — prefer them over inventing new ones):

- `seo` — `MetaTags.astro`, the JSON-LD builders in `src/config/schemas.ts`, sitemap, `llms.txt`, robots, redirects
- `ui` — components under `src/components/`, layout, Tailwind styling
- `blog` — blog articles (`src/content/blog/`) and the `/blog` routes
- `destinations` — destination entries (`src/content/destinations/`) and the `/destinos` routes
- `viajeros` — customer testimonials (`src/content/customers/`) and the `/viajeros` routes
- `a11y` — accessibility fixes (labels, focus, contrast, semantics)
- `images` — assets under `src/assets/`, `<Image>` usage, format/size optimization
- `config` — `astro.config.mjs`, `tsconfig.json`, `.prettierrc`, `vercel.json`
- `deps` — dependency bumps

## Rules

- Keep the title under 72 characters.
- Use the imperative mood: "add rate limiting" not "added rate limiting".
- Do not mention file names in the title unless the file name _is_ the feature.
- Do not include the scope if the change is truly cross-cutting.
- Content is Spanish — commit messages stay in English, but don't "correct" Spanish copy in the diff.
- If the diff touches `src/content.config.ts` (the Zod collection schemas), existing entries may no longer validate. Run `pnpm build` before committing and warn the user if it fails.
- If the diff adds an `image:` / `destinationFlagImage:` frontmatter reference, it must point into `src/assets/` via a relative path — never `/public`. Warn if you see otherwise.
- Never commit anything in `.env` — if staged, warn the user immediately and do not proceed.

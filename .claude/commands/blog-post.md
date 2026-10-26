---
description: Plan and write a new blog article from a keyword and the travellers' own notes
argument-hint: <keyword> [notes / anecdotes]
---

# Blog post

Write a new travel guide for the Kilómetros por Explorar blog. Input: $ARGUMENTS — a primary keyword, plus whatever notes, anecdotes, prices or photos Lucas & Lucía supply.

The audience is independent travellers who want deep, practical, honest guides based on real experience. The article exists to rank in search and to turn readers into clients of the personalized trip-planning service, without sounding like a sales pitch.

## Workflow

1. **Plan, then stop.** Present the SEO plan and outline (below) and wait for approval before writing. This is the checkpoint where the user corrects the angle and adds anecdotes.
2. **Write** the article to `frontend/src/content/blog/<slug>.md` in one pass, following every rule in this file.
3. **Verify** (see the last section) and report anything that needs the user: a missing cover image, facts you could not confirm, sections that need a personal anecdote.

## 1. SEO plan

- **Primary keyword**, 3-5 secondary keywords (variations) and LSI terms.
- **Search intent** (informational, navigational or commercial) and how the article resolves it.
- **Slug**: short, contains the primary keyword, no stop words (de, la, el, en, para, un, una). Check it does not collide with an existing file in `frontend/src/content/blog/`.
- **FAQs**: 5-8 real questions ("¿Cómo...?", "¿Cuánto...?", "¿Dónde...?").
- **Outline**: every H2/H3 with 2-3 bullets on what that section must cover. Mark which sections need a personal anecdote you do not have yet.

Heading rules:

- At least 1-2 H2s contain the primary keyword; secondary keywords are spread naturally across the rest.
- **Question H2** ("¿Cuál es la mejor época...?"): the first paragraph answers it directly in under 50 words.
- **"Qué ver en X" style H2**: a numbered or bulleted list immediately after the heading.

## 2. Voice

Write as Lucas and/or Lucía: first person singular or plural, close, like talking to a travelling friend, honest and practical. Passion without tourist hype; say the uncomfortable truth about safety, money and tourist traps, including your own mistakes ("Nosotros caímos en la trampa de...").

- **Personal anecdotes come only from the notes the user gave you.** Never invent a trip, a meal, a mishap or an opinion attributed to Lucas or Lucía. If a section needs one and there is none, leave it impersonal and flag it.
- **Personal tics are scarce.** Expressions like "En mi experiencia", "Admito que", "Truco pro", "La verdad es que" are used sparingly, and **no single one more than once** per article.
- **Opening hook**: never start by summarising the article. Open with a provocative question, a figure, a contrast ("A primera vista parece... pero...") or a confession.
- **No emojis** in the body. Dense in value, not in words.

## 3. Banned words

None of these may appear in the article — body, headings, frontmatter or FAQs:

- **Tourist clichés**: "joya escondida", "joya oculta", "paraíso terrenal", "imprescindible(s)", "experiencia única", "inolvidable", "destino de ensueño", "lugar mágico", "de película". Use "vale la pena conocer", "hay algo especial en..." or, better, say concretely what makes the place worth it.
- **AI giveaways**: "sin duda", "sin duda alguna", "no te dejará indiferente", "a continuación te mostramos", "cabe destacar", "es importante destacar", "en conclusión", "en definitiva", "hablando en plata", "de hecho", "es de suma importancia".

Limited:

- **Vague adjectives** — increíble, espectacular, asombroso, brutal, alucinante: at most **one** of them, once, in the whole article. Describe instead of qualifying.
- **Weak verbs** — "es", "hay", "tiene", "se puede", "ofrece": rewrite to a concrete verb wherever the sentence allows it.

## 4. Accuracy

Readers plan real trips with this. Prefer being vaguer to being wrong.

- **Do not invent specificity**: no exact timetables, cent-level prices or specific bus/metro lines unless the user supplied them or you verified them on an official source.
- Use ranges and hedged language: "22-26€", "alrededor de las 09:00", "aproximadamente".
- **Mandatory warning**: if the article contains prices, timetables or transport, include this block exactly once, where it reads naturally:

  ```markdown
  > **⚠️ Nota importante:** Los precios, horarios y normativas pueden cambiar. Verifica siempre en webs oficiales antes de tu viaje.
  ```

## 5. Formatting and readability

- **No paragraph over 60 words.** Split it or turn it into a list.
- **Break the text** at least every ~300 words and in every H2 section: a list, a Google Maps link (`[Ver ubicación en el mapa](url)`) or bolded key terms.
- **Bold** only place names, dishes and key concepts — never whole sentences.
- **Prices** without a space before the symbol: "22,50€", "100-200€". **Times** in 24h: "09:00", "18:00".
- **At least 3 internal links**, spread through the body, using root-relative paths (`/blog/<slug>`, `/destinos/<slug>`). Every target must exist in `frontend/src/content/blog/` or `frontend/src/content/destinations/`.
- **No manual table of contents** — the side rail is generated from the headings.

## 6. Alerts

**1 or 2 alerts** per article, never consecutive, each placed right after a dense section. Syntax (`remark-github-blockquote-alert` with a custom title; type is one of NOTE, TIP, IMPORTANT, WARNING, CAUTION):

```markdown
> [!WARNING/¿No consigues entradas para el Reichstag?]
> First paragraph: a real, honest problem with the destination (limited availability, complicated logistics...).
>
> Second paragraph: how our trip-planning service solves exactly that, conversational — never a hard sell or a price.
```

## 7. Closing

The article ends with this structure, with no "Para terminar" style summary:

1. A closing H2 section of 1-2 paragraphs: a personal, pragmatic or motivational reflection that connects with the reader.
2. A CTA subheading: `### ¿Quieres este viaje, pero mejorado?` or a close variant.
3. A short pitch for the service: route design, recommendations, the mobile app.
4. The final line, exactly: `[Reserva aquí tu videollamada gratuita de diagnóstico](/contacto)`

## 8. Frontmatter

`frontend/src/content.config.ts` is the source of truth for the `blog` schema — read it before writing frontmatter. On top of the schema:

- `title`: attractive SEO title with the primary keyword.
- `description`: 140-160 characters.
- `date`: today's date.
- `image`: `'../../assets/images/blog/<slug>/cover.webp'`. You cannot produce this file; if the user has not provided it, tell them the build will fail until it exists.
- `imageAlt`: describes what the cover actually shows.
- `destinations`: slugs of existing entries in `frontend/src/content/destinations/`.
- `faqs`: the FAQs from the plan; answers are short, and key figures or names go in `<strong>...</strong>` like the existing posts.

## Verify before reporting

1. Grep the new file (case-insensitive) for every banned word in section 3 and fix any hit.
2. Re-check the countable rules: paragraph length, internal links ≥ 3 and resolving, alerts 1-2, the warning block present if there are prices/times/transport, closing ends with the exact CTA link.
3. Run `pnpm build`. If it fails only because the cover image is missing, say so; any other failure must be fixed.
4. Hand the article path and the user's notes to the `blog-reviewer` agent. Fix every finding it reports, except ones you disagree with — list those for the user with your reason. Run it once only; do not loop.

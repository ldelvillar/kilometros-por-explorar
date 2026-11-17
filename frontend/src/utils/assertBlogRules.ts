import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = 'src/content/blog';
const DESTINATIONS_DIR = 'src/content/destinations';

// Posts written or refreshed before the rulebook existed are exempt from the
// house rules; only their internal links are checked.
const RULES_SINCE = '2026-10-26';

// Keep in sync with section 3 of .claude/commands/blog-post.md.
const BANNED = [
  'joyas? escondidas?',
  'joyas? ocultas?',
  'paraíso terrenal',
  'imprescindibles?',
  'experiencias? únicas?',
  'inolvidables?',
  'destinos? de ensueño',
  'lugar(es)? mágicos?',
  'de película',
  'sin duda',
  'no te dejará indiferente',
  'a continuación te mostramos',
  'cabe destacar',
  'es importante destacar',
  'en conclusión',
  'en definitiva',
  'hablando en plata',
  'de hecho',
  'es de suma importancia',
];
const VAGUE = [
  'increíbles?',
  'espectacular(es)?',
  'asombros[oa]s?',
  'brutal(es)?',
  'alucinantes?',
];

const WARNING_TITLE = '> [!WARNING/Nota importante]';
const WARNING_TEXT =
  '> Los precios, horarios y normativas pueden cambiar. Verifica siempre en webs oficiales antes de tu viaje.';
const FINAL_CTA =
  '[Reserva aquí tu videollamada gratuita de diagnóstico](/contacto)';

// Whole-word, case-insensitive match that also respects accented letters.
const wordRegex = (terms: string[]) =>
  new RegExp(
    `(?<![\\p{L}\\p{N}])(${terms.join('|')})(?![\\p{L}\\p{N}])`,
    'giu'
  );

type Block = { line: number; lines: string[] };

const slugsIn = (dir: string) =>
  new Set(
    fs
      .readdirSync(dir)
      .filter(file => !file.startsWith('_') && /\.mdx?$/.test(file))
      .map(file => file.replace(/\.mdx?$/, ''))
  );

// Single-line, single-quoted YAML values, which is how Prettier leaves them.
const readField = (frontmatter: string, field: string) =>
  [...frontmatter.matchAll(new RegExp(`^\\s*-?\\s*${field}: (.*)$`, 'gm'))].map(
    ([, value]) =>
      value
        .trim()
        .replace(/^'(.*)'$/, '$1')
        .replace(/''/g, "'")
  );

// Splits the body into blank-line separated blocks, keeping the file line of
// each one so the errors can point at it.
const toBlocks = (body: string[], offset: number) => {
  const blocks: Block[] = [];
  let current: Block | undefined;
  body.forEach((text, i) => {
    if (text.trim() === '') current = undefined;
    else if (current) current.lines.push(text);
    else blocks.push((current = { line: offset + i + 1, lines: [text] }));
  });
  return blocks;
};

const isAlert = (block: Block) => /^> \[!\w+\/.*\]$/.test(block.lines[0]);
const isList = (block: Block) => /^(\s*[-*+]|\d+\.)\s/.test(block.lines[0]);
const isParagraph = (block: Block) =>
  !/^(#|>|\||!\[|```|<)/.test(block.lines[0]) && !isList(block);

const countWords = (text: string) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>|\*\*/g, '')
    .split(/\s+/)
    .filter(word => /[\p{L}\p{N}]/u.test(word)).length;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[¿?¡!.:]/g, '')
    .trim();

const checkPost = (
  slug: string,
  source: string,
  blogSlugs: Set<string>,
  destinationSlugs: Set<string>
) => {
  const errors: string[] = [];
  const error = (line: number, message: string) =>
    errors.push(`${slug}.md:${line} — ${message}`);

  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const end = lines.indexOf('---', 1);
  const frontmatter = lines.slice(1, end).join('\n');
  const body = lines.slice(end + 1);
  const bodyText = body.join('\n');
  const lineOf = (index: number, text = bodyText, offset = end + 1) =>
    offset + text.slice(0, index).split('\n').length;

  for (const match of bodyText.matchAll(/\]\(\/(blog|destinos)\/([^)#\s]+)/g)) {
    const [, section, target] = match;
    const slugs = section === 'blog' ? blogSlugs : destinationSlugs;
    if (!slugs.has(target))
      error(lineOf(match.index), `enlace roto a /${section}/${target}`);
  }

  const date =
    readField(frontmatter, 'updatedDate')[0] ??
    readField(frontmatter, 'date')[0];
  if (!date || date < RULES_SINCE) return errors;

  // Words: the whole file, frontmatter and FAQs included.
  const fullText = lines.join('\n');
  for (const match of fullText.matchAll(wordRegex(BANNED)))
    error(lineOf(match.index, fullText, 0), `palabra prohibida "${match[0]}"`);
  const vague = [...fullText.matchAll(wordRegex(VAGUE))];
  if (vague.length > 1)
    error(
      lineOf(vague[1].index, fullText, 0),
      `${vague.length} adjetivos vagos (${vague.map(m => m[0]).join(', ')}); el máximo es 1`
    );
  for (const match of fullText.matchAll(/\[TK/g))
    error(lineOf(match.index, fullText, 0), 'marcador [TK] sin resolver');

  // Frontmatter.
  const description = readField(frontmatter, 'description')[0] ?? '';
  if (description.length < 140 || description.length > 160)
    error(
      1,
      `description tiene ${description.length} caracteres; deben ser 140-160`
    );
  const questions = readField(frontmatter, 'question');
  if (questions.length < 5 || questions.length > 8)
    error(1, `${questions.length} FAQs; deben ser 5-8`);
  const image = `../../assets/images/blog/${slug}/cover.webp`;
  if (readField(frontmatter, 'image')[0] !== image)
    error(1, `image debe ser '${image}'`);

  // Body text.
  for (const match of bodyText.matchAll(/\p{Extended_Pictographic}/gu))
    error(lineOf(match.index), `emoji "${match[0]}"`);
  for (const match of bodyText.matchAll(/\]\(#/g))
    error(lineOf(match.index), 'índice manual; el lateral se genera solo');
  for (const match of bodyText.matchAll(/\d+\s+€/g))
    error(lineOf(match.index), `precio con espacio antes de €: "${match[0]}"`);
  for (const match of bodyText.matchAll(
    /(?<![\d:])\d:\d{2}(?!\d)|\d\s?(am|pm|a\. ?m\.|p\. ?m\.)(?!\p{L})/giu
  ))
    error(
      lineOf(match.index),
      `hora fuera del formato 24h "09:00": "${match[0]}"`
    );

  const internalLinks = bodyText.match(/\]\(\/(blog|destinos)\//g) ?? [];
  if (internalLinks.length < 3)
    error(end + 1, `${internalLinks.length} enlaces internos; el mínimo es 3`);

  // Blocks: paragraphs, headings, alerts.
  const blocks = toBlocks(body, end + 1);
  const h2s = new Set<string>();
  blocks.forEach((block, i) => {
    const next = blocks[i + 1];
    const heading = block.lines[0].match(/^## (.*)/)?.[1];

    if (heading) {
      h2s.add(normalize(heading));
      if (heading.startsWith('¿')) {
        if (!next || !isParagraph(next))
          error(
            block.line,
            'H2 en forma de pregunta sin párrafo de respuesta directa'
          );
        else if (countWords(next.lines.join(' ')) >= 50)
          error(
            next.line,
            'la respuesta directa a un H2 pregunta debe tener menos de 50 palabras'
          );
      }
      if (/^qué ver/i.test(heading) && (!next || !isList(next)))
        error(block.line, 'un H2 "Qué ver" debe ir seguido de una lista');
    }

    // Alert paragraphs are separated by a bare ">" line.
    const paragraphs = isAlert(block)
      ? block.lines
          .slice(1)
          .join('\n')
          .split(/\n>\s*\n/)
      : isParagraph(block)
        ? [block.lines.join(' ')]
        : [];
    for (const paragraph of paragraphs) {
      const words = countWords(paragraph.replace(/^>\s?/gm, ''));
      if (words > 60)
        error(block.line, `párrafo de ${words} palabras; el máximo es 60`);
    }

    if (isAlert(block) && next && isAlert(next))
      error(next.line, 'dos alertas seguidas');
  });

  for (const question of questions)
    if (h2s.has(normalize(question)))
      error(1, `la FAQ "${question}" repite un H2`);

  // Alerts: the mandatory warning plus 1-2 that pitch the service.
  const alerts = blocks.filter(isAlert);
  const warnings = alerts.filter(block => block.lines[0] === WARNING_TITLE);
  const pitches = alerts.length - warnings.length;
  if (pitches < 1 || pitches > 2)
    error(
      end + 1,
      `${pitches} alertas (sin contar la nota de precios); deben ser 1-2`
    );
  if (warnings.length > 1)
    error(warnings[1].line, 'la nota de precios aparece más de una vez');
  for (const warning of warnings)
    if (warning.lines.length !== 2 || warning.lines[1] !== WARNING_TEXT)
      error(warning.line, 'el texto de la nota de precios no es el exacto');
  if (!warnings.length && /\d€|\d:\d{2}/.test(bodyText))
    error(end + 1, 'hay precios u horas pero falta la nota de precios');

  const lastLine = body.findLastIndex(text => text.trim() !== '');
  if (body[lastLine]?.trim() !== FINAL_CTA)
    error(
      end + lastLine + 2,
      `la última línea debe ser exactamente ${FINAL_CTA}`
    );

  return errors;
};

/**
 * Enforces the countable rules of `.claude/commands/blog-post.md` at build
 * time, so a post can't ship with a banned word, a broken internal link or a
 * leftover `[TK]` marker. The judgement calls (invented anecdotes, the
 * opening hook, seasonal coherence) stay with the `blog-reviewer` agent.
 */
export const assertBlogRules = () => {
  const blogSlugs = slugsIn(BLOG_DIR);
  const destinationSlugs = slugsIn(DESTINATIONS_DIR);

  const errors = [...blogSlugs].flatMap(slug => {
    const file = fs.existsSync(path.join(BLOG_DIR, `${slug}.md`))
      ? `${slug}.md`
      : `${slug}.mdx`;
    const source = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    return checkPost(slug, source, blogSlugs, destinationSlugs);
  });

  if (errors.length) {
    throw new Error(
      `Hay ${errors.length} incumplimientos de las normas del blog (.claude/commands/blog-post.md):\n${errors.join('\n')}`
    );
  }
};

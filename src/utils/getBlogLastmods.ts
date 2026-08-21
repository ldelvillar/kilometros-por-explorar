import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = 'src/content/blog';

// Reads a YYYY-MM-DD frontmatter value, quoted or not.
const readDate = (frontmatter: string, field: string) =>
  frontmatter
    .split('\n')
    .find(line => line.startsWith(`${field}:`))
    ?.match(/\d{4}-\d{2}-\d{2}/)?.[0];

/**
 * Maps every blog URL to the date it last changed, plus `/blog` itself (the
 * newest of them). The sitemap is built in `astro.config.mjs`, where
 * `astro:content` is not available, so the frontmatter is read straight off
 * disk instead of through `getCollection`.
 */
export const getBlogLastmods = () => {
  const lastmods = new Map<string, string>();
  let newest = '';

  for (const file of fs.readdirSync(BLOG_DIR)) {
    if (file.startsWith('_') || !/\.mdx?$/.test(file)) continue;

    const source = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const lastmod =
      readDate(frontmatter, 'updatedDate') ?? readDate(frontmatter, 'date');

    if (!lastmod) {
      throw new Error(
        `El artículo "${file}" no tiene una fecha legible en el frontmatter, así que no puede declarar lastmod en el sitemap.`
      );
    }

    // ISO dates compare correctly as strings.
    lastmods.set(`/blog/${file.replace(/\.mdx?$/, '')}`, lastmod);
    if (lastmod > newest) newest = lastmod;
  }

  lastmods.set('/blog', newest);

  return lastmods;
};

import type { CollectionEntry } from 'astro:content';

/**
 * Orders articles newest first by publication date — the order every blog
 * listing on the site uses. Sorts a copy, since `getCollection` hands the same
 * entries to other callers.
 */
export const getSortedPosts = (posts: CollectionEntry<'blog'>[]) =>
  [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

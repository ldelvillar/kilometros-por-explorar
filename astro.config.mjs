// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import { unified } from '@astrojs/markdown-remark';
import { remarkAlert } from 'remark-github-blockquote-alert';

import { SITE_CONFIG } from './src/config/site.ts';
import { rehypeImageFigures } from './src/utils/rehypeImageFigures.ts';
import { rehypeToc } from './src/utils/rehypeToc.ts';
import { getBlogLastmods } from './src/utils/getBlogLastmods.ts';

const blogLastmods = getBlogLastmods();

// https://astro.build/config
export default defineConfig({
  site: SITE_CONFIG.domain,
  trailingSlash: 'never',
  env: {
    schema: {
      PUBLIC_CONTACT_FORM_ENDPOINT: envField.string({
        context: 'client',
        access: 'public',
      }),
      PUBLIC_CHATBOT_WEBHOOK_ENDPOINT: envField.string({
        context: 'client',
        access: 'public',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    layout: 'constrained',
    responsiveStyles: false,
    breakpoints: [640, 828, 1080, 1440, 1920],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkAlert, { legacyTitle: true }]],
      rehypePlugins: [rehypeToc, rehypeImageFigures],
    }),
  },
  integrations: [
    sitemap({
      // Only the blog tracks when an entry actually changed. Every other page ships without lastmod
      serialize(item) {
        const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';

        if (pathname.startsWith('/blog/') && !blogLastmods.has(pathname)) {
          throw new Error(
            `La URL "${pathname}" no coincide con ningún artículo de src/content/blog, así que se quedaría sin lastmod en el sitemap.`
          );
        }

        const lastmod = blogLastmods.get(pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    preact(),
  ],
});

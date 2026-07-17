// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import { unified } from '@astrojs/markdown-remark';
import { remarkAlert } from 'remark-github-blockquote-alert';

import { SITE_CONFIG } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_CONFIG.domain,
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkAlert, { legacyTitle: true }]],
    }),
  },
  integrations: [sitemap({ lastmod: new Date() }), preact()],
});

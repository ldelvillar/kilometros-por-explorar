// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import preact from '@astrojs/preact';

import { unified } from '@astrojs/markdown-remark';

import { remarkAlert } from 'remark-github-blockquote-alert';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.kilometrosporexplorar.es',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkAlert, { legacyTitle: true }]],
    }),
  },
  integrations: [sitemap(), preact()],
});

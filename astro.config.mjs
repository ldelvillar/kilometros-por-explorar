// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.kilometrosporexplorar.es',
  redirects: {
    '/clientes': '/viajeros',
    '/clientes/[slug]': '/viajeros/[slug]',
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), preact()],
});

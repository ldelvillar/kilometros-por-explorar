import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const destinations = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/destinations',
  }),
  schema: z.object({
    name: z.string(),
    shortDescription: z.string(),
    longDescription: z.string(),
    image: z.string(),
    category: z.enum([
      'cultural',
      'playa',
      'naturaleza',
      'ciudad',
      'destacados',
      'barco',
      'sorpresa',
    ]),
    featured: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string(),
    author: z.string(),
    destinations: z.array(z.string()),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
});

const customers = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/customers',
  }),
  schema: z.object({
    featured: z.boolean().default(false),
    title: z.string(),
    name: z.string(),
    image: z.string(),
    destination: z.object({
      name: z.string(),
      href: z.string(),
    }),
    destinationFlagImage: z.string(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .length(4),
    description: z.string(),
  }),
});

export const collections = {
  destinations,
  blog,
  customers,
};

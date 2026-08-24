import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const destinations = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/destinations',
  }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string(),
        country: z.string().optional(),
        shortDescription: z.string().max(160),
        longDescription: z.string(),
        image: image(),
        imageAlt: z.string(),
        category: z.enum([
          'cultural',
          'playa',
          'naturaleza',
          'ciudad',
          'barco',
          'sorpresa',
        ]),
        featured: z.boolean().default(false),
        bestSeason: z.string(),
        idealDuration: z.string(),
        budget: z.number().min(0),
        classicRouteElements: z.array(z.string()).length(4),
        faqs: z
          .array(
            z.object({
              question: z.string(),
              answer: z.string(),
            })
          )
          .min(4)
          .max(5),
      })
      .refine(data => data.category === 'sorpresa' || Boolean(data.country), {
        message:
          "El campo 'country' es obligatorio salvo para los packs de categoría 'sorpresa'.",
        path: ['country'],
      }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().max(160),
        date: z.date(),
        updatedDate: z.date().optional(),
        image: image(),
        destinations: z.array(reference('destinations')),
        faqs: z
          .array(
            z.object({
              question: z.string(),
              answer: z.string(),
            })
          )
          .min(1),
      })
      .refine(data => !data.updatedDate || data.updatedDate >= data.date, {
        message: "El campo 'updatedDate' no puede ser anterior a 'date'.",
        path: ['updatedDate'],
      }),
});

const customers = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/customers',
  }),
  schema: ({ image }) =>
    z.object({
      featured: z.boolean().default(false),
      title: z.string(),
      name: z.string(),
      image: image(),
      destination: reference('destinations'),
      destinationFlagImage: image(),
      metrics: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .length(4),
      description: z.string(),
      metaDescription: z.string().max(160),
    }),
});

export const collections = {
  destinations,
  blog,
  customers,
};

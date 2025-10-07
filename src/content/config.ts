import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string(),
    author: z.string(),
    destinations: z.array(z.string()),
  }),
});

const customers = defineCollection({
  type: 'content',
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
  blog,
  customers,
};

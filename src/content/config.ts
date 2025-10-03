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
  name: z.string(),
  testimonial: z.string(),
  href: z.string(),
  image: z.string(),
  destination: z.string(),
});

export const collections = {
  blog,
  customers,
};

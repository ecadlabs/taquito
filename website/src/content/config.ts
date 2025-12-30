import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    author: z.union([z.string(), z.array(z.string())]).optional(),
    id: z.string().optional(),
  }).passthrough(),
});

export const collections = {
  docs,
};


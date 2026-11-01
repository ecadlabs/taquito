import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/docs',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    author: z.union([z.string(), z.array(z.string())]).optional(),
    id: z.string().optional(),
  }).passthrough(),
});

export const collections = {
  docs,
};

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const research = defineCollection({
  loader: glob({ base: './src/content/research', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    status: z.enum(['preparing', 'active', 'published']),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    order: z.number().default(0),
    lang: z.enum(['en', 'zh']),
    draft: z.boolean().default(false),
    translationKey: z.string(),
    bibtex: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

const ideas = defineCollection({
  loader: glob({ base: './src/content/ideas', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    status: z.enum(['seed', 'exploring', 'parked']),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['en', 'zh']),
    draft: z.boolean().default(false),
    translationKey: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    lang: z.enum(['en', 'zh']),
    draft: z.boolean().default(false),
    translationKey: z.string(),
  }),
});

export const collections = { research, ideas, blog };

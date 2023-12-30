import { defineCollection, z } from "astro:content";

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    authors: z.string().array().nonempty(),
    description: z.string(),
    draft: z.boolean().default(false),
    category: z.enum([
      "CSS, TailwindCSS",
      "JavaScript",
      "TypeScript",
      "NextJS",
      "ReactJS",
      "Test",
    ]),
    tags: z.string().array().nonempty(),
    heroImageUrl: z.string(),
  }),
});

export const collections = { post };

import { defineCollection, z } from "astro:content";

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
    description: z.string(),
    draft: z.boolean().default(false),
    category: z.enum([
      "CSS, TailwindCSS",
      "JavaScript",
      "NextJS",
      "ReactJS",
      "Test",
    ]),
  }),
});

export const collections = { post };

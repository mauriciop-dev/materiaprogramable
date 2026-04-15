import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.string().optional(),
            category: z.enum(['fundamentos', 'actualidad', 'casos-de-uso', 'opinion', 'investigacion']).default('fundamentos'),
            lang: z.enum(['es', 'en']).default('es'),
            ogImage: z.string().optional(),
			animation: z.object({
				theme: z.string().default('sci-fi'),
				primaryColor: z.string().default('#00ffff'),
				secondaryColor: z.string().default('#8b5cf6'),
				particleCount: z.number().default(1500),
				shape: z.string().default('particles'),
				movement: z.string().default('floating'),
				speed: z.number().default(1.0),
				interaction: z.string().default('mouse'),
				cameraMode: z.string().default('auto-rotate'),
				specialEffects: z.string().default('glow')
			}).optional()
		}),
});

export const collections = { blog };

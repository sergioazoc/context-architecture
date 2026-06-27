import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// Manifesto content. One markdown file per locale per page. The body is the
// human view (rendered) and the agent view (raw): a single source of truth.
const docSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Canonical, citable definition, rendered in the hero and exposed to SEO.
  definition: z.string().optional(),
  // Dated attribution line (mono), shown under the definition.
  attribution: z.string().optional(),
  // Short eyebrow label above the hero title.
  eyebrow: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      // Only the manifesto pages. AGENTS.md (and its CLAUDE.md symlink) are
      // boundary docs, not routes.
      source: {
        include: '**/*.md',
        exclude: ['**/AGENTS.md', '**/CLAUDE.md'],
      },
      schema: docSchema,
    }),
  },
})

import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        releases: defineCollection({
            type: 'page',
            source: 'releases/**/*.md',
            schema: z.object({
                title: z.string(),
                // YAML parses bare dates as Date objects; transform to YYYY-MM-DD string
                date: z.union([z.string(), z.date()]).transform(v =>
                    v instanceof Date ? v.toISOString().slice(0, 10) : v
                ),
                slug: z.string(),
                excerpt: z.string(),
                videoId: z.string(),
                genre: z.string().optional(),
                bpm: z.number().optional(),
                tags: z.array(z.string()).optional(),
            })
        })
    }
})

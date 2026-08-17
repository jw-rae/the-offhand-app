// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: process.env.NODE_ENV !== 'production' },

    modules: ['@nuxt/content'],

    ssr: true,

    app: {
        head: {
            title: 'Ezabad — Music Production',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Ezabad — original beats, tracks, and music production.' },
                { name: 'theme-color', content: '#0d9e89' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ]
        }
    },

    vite: {
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
            ]
        }
    },

    nitro: {
        preset: process.env.NODE_ENV === 'production' ? 'azure' : undefined,
        prerender: {
            crawlLinks: true,
            routes: ['/', '/catalog', '/subscribe']
        }
    },

    runtimeConfig: {
        resendApiKey: process.env.RESEND_API_KEY ?? '',
        emailFrom: 'Ezabad <newsletter@ezabad.com>'
    }
})

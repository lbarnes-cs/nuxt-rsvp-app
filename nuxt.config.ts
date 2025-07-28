// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify';
import basicAuthMiddleware from './server/middleware/basicAuth';
import viteConfig from './vite.config.shared';

export default defineNuxtConfig({
  nitro: {
    preset: 'netlify',
    devHandlers: [
      {
        route: '/admin',
        handler: basicAuthMiddleware,
      },
    ],
  },

  // ... other Nuxt configurations
  vite: viteConfig,

  devServer: {
    port: 3000, // Note: hard coded port
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(
          vuetify({
            autoImport: true,
            styles: {
              configFile: 'assets/styles/vuetify.scss',
            },
          }),
        );
      });
    },
  ],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'add-to-calendar-button',
    },
  },

  i18n: {
    // WARN  bundle.optimizeTranslationDirective is enabled by default, we recommend disabling this feature as it causes issues and will be deprecated in v10.
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
        isCatchallLocale: true,
      },
      { code: 'fr', iso: 'fr-FR', name: 'French', file: 'fr.json' },
      { code: 'pl', iso: 'pl-PL', name: 'Polish', file: 'pl.json' },
      { code: 'de', iso: 'de-DE', name: 'German', file: 'de.json' },
      { code: 'it', iso: 'it-IT', name: 'Italian', file: 'it.json' },
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
  },

  css: ['vuetify/styles', '@/assets/styles/main.scss'],

  compatibilityDate: '2024-11-17',

  runtimeConfig: {
    public: {
      // If you need the key on the client (expose cautiously)
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  app: {
    head: {
      // titleTemplate: "%s | web app",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&Tangerine:wght@400;700&display=swap',
        },
      ],
      meta: [
        {
          property: 'og:image',
          content: process.env.NUXT_PUBLIC_SITE_URL + '/og-image.jpg',
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' },
      ],
    },
  },
});

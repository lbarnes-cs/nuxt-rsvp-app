// // https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import basicAuthMiddleware from "./server/middleware/basicAuth";

export default defineNuxtConfig({
  nitro: {
    preset: "netlify",
    devHandlers: [
      {
        route: "/admin",
        handler: basicAuthMiddleware,
      },
    ],
  },

  build: {
    transpile: ["vuetify"],
  },

  modules: [
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(
          vuetify({
            autoImport: true,
            styles: {
              configFile: "assets/styles/vuetify.scss",
            },
          })
        );
      });
    },
  ],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === "add-to-calendar-button",
    },
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ["vuetify"],
    },
  },

  i18n: {
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
        isCatchallLocale: true,
      },
      { code: "fr", iso: "fr-FR", name: "French", file: "fr.json" },
      { code: "pl", iso: "pl-PL", name: "Polish", file: "pl.json" },
      { code: "de", iso: "de-DE", name: "German", file: "de.json" },
      { code: "it", iso: "it-IT", name: "Italian", file: "it.json" },
    ],
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
      fallbackLocale: "en",
    },
  },

  css: ["vuetify/styles", "@/assets/styles/main.scss"],

  compatibilityDate: "2025-02-20",

  runtimeConfig: {
    public: {
      // If you need the key on the client (expose cautiously)
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&Tangerine:wght@400;700&display=swap",
        },
      ],
      meta: [
        // {
        //   property: "og:image",
        //   content: "https://demo.comingsoon.com/og-image.jpg",
        // },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:type", content: "image/jpeg" },
      ],
    },
  },
});

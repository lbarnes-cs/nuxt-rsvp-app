export default defineI18nConfig(() => ({
  locales: [
    { code: "en", iso: "en-US", name: "English", file: "en.json" },
    { code: "fr", iso: "fr-FR", name: "French", file: "fr.json" },
    { code: "pl", iso: "pl-PL", name: "Polish", file: "pl.json" },
    { code: "de", iso: "de-DE", name: "German", file: "de.json" },
  ],
  defaultLocale: "en",
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    alwaysRedirect: true,
    fallbackLocale: "en",
  },
}));

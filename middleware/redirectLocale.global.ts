export default defineNuxtRouteMiddleware((to) => {
  // Ensure middleware logic runs only on the client side
  if (import.meta.server) return;

  const i18n = useNuxtApp().$i18n;
  const { locales, defaultLocale, locale: currentLocale, setLocale } = i18n;

  // Parse locales to an array of codes (if locales are objects)
  const localeCodes = Array.isArray(locales)
    ? locales.map((locale) =>
        typeof locale === 'string' ? locale : locale.code,
      )
    : [];

  // Detect browser language
  const browserLang = navigator.language || navigator.userLanguage;

  // Find a matching locale from browser language
  const matchedLocale =
    localeCodes.find((locale) =>
      browserLang.toLowerCase().startsWith(locale.toLowerCase()),
    ) || defaultLocale;

  // Avoid redirect if the default locale is "en" and the user is already in "en"
  if (matchedLocale === defaultLocale && defaultLocale === 'en') {
    return;
  }

  // Set locale if it differs from the current one
  if (currentLocale !== matchedLocale) {
    setLocale(matchedLocale);
    if (!to.path.startsWith(`/${matchedLocale}`)) {
      return navigateTo(`/${matchedLocale}${to.path}`);
    }
  }
});

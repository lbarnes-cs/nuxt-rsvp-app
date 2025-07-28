import { format, parseISO } from 'date-fns';
import { enUS, de, fr, it, pl, type Locale } from 'date-fns/locale'; // Import the locales you need

type LocaleKey = 'en' | 'de' | 'fr' | 'it' | 'pl'; // Add more locales as needed

export function useDateFormatter() {
  const { locale } = useI18n();

  // Map i18n locales to date-fns locales
  const localeMap: Record<LocaleKey, Locale> = {
    en: enUS,
    de: de,
    fr: fr,
    it: it,
    pl: pl,
  };

  // Helper to get the current locale for date-fns
  const getCurrentLocale = (): Locale => {
    const currentLocale = locale.value as LocaleKey;
    return localeMap[currentLocale] || enUS; // Default to enUS if locale is unsupported
  };

  /**
   * Format the locale date object
   * eg: Wednesday, July 9th 2025
   *
   * Documentation: https://date-fns.org/v4.1.0/docs/format
   *
   * @param time
   * @param formatPattern
   * @returns {string}
   */
  const formatLocaleDate = (
    date: string | Date,
    formatPattern: string = "EEEE, MMMM d'th' yyyy",
  ): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;

      return format(dateObj, formatPattern, {
        locale: getCurrentLocale(),
      });
    } catch (error) {
      console.error('Invalid date provided to formatLocaleDate:', date, error);
      return '';
    }
  };

  /**
   * Format the dateTime object
   *
   * format "p" sets "Long localized time"
   * eg: 12:00 AM
   *
   * Documentation: https://date-fns.org/v4.1.0/docs/format
   *
   * @param time
   * @param formatPattern
   * @returns {string}
   */
  const formatLocaleTime = (
    time: string | Date,
    formatPattern: string = 'p',
  ): string => {
    try {
      const timeObj =
        typeof time === 'string' ? parseISO(`1970-01-01T${time}`) : time;

      const formattedTime = format(timeObj, formatPattern, {
        locale: getCurrentLocale(),
      });

      return formattedTime;
    } catch (error) {
      console.error('Invalid time provided to formatLocaleTime:', time, error);
      return '';
    }
  };

  /**
   * Formats a date string into a readable format as "YYYY-MM-DD"
   *
   * @param date The date string or null
   */
  const formatDate = (date: Date | string | null): string => {
    if (date) {
      return format(new Date(date), 'yyyy-MM-dd');
    }

    return ''; // Handle edge case if date is neither Date nor string
  };

  return {
    formatDate,
    formatLocaleDate,
    formatLocaleTime,
  };
}

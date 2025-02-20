import { format, parseISO } from "date-fns";
import { enUS, de, fr, it, pl, type Locale } from "date-fns/locale"; // Import the locales you need

type LocaleKey = "en" | "de" | "fr" | "it" | "pl"; // Add more locales as needed

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

  // Function to format date
  const formatLocaleDate = (
    date: string | Date,
    formatPattern: string = "PP"
  ): string => {
    try {
      const dateObj = typeof date === "string" ? parseISO(date) : date;
      // return format(dateObj, formatPattern, { locale: getCurrentLocale() });

      return format(dateObj, "EEEE, MMMM dd'th' yyyy", {
        locale: getCurrentLocale(),
      });
    } catch (error) {
      console.error("Invalid date provided to formatLocaleDate:", date, error);
      return "";
    }
  };

  // Function to format time
  const formatLocaleTime = (
    time: string | Date,
    formatPattern: string = "p"
  ): string => {
    try {
      const timeObj =
        typeof time === "string" ? parseISO(`1970-01-01T${time}`) : time;
      const formattedTime = format(timeObj, formatPattern, {
        locale: getCurrentLocale(),
      });

      return formattedTime;
    } catch (error) {
      console.error("Invalid time provided to formatLocaleTime:", time, error);
      return "";
    }
  };

  // Helper function to format date as "YYYY-MM-DD"
  function formatDate(date: Date | string): string {
    if (date) {
      const localDate = new Date(date); // Convert to Date object
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(localDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
    }

    return ""; // Handle edge case if date is neither Date nor string
  }

  // Helper function to format date as "YYYY-MM-DDT00:00:00"
  const formatDateWithTime = (date: Date | string, time?: string): string => {
    if (date) {
      const localDate = new Date(date);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}${time}`;
    }

    return "";
  };

  return {
    formatDate,
    formatDateWithTime,
    formatLocaleDate,
    formatLocaleTime,
  };
}

import { useRouter } from "next/router";
import dayjs from "dayjs";
import _ from "lodash";
import * as loc from "date-fns/locale";

const Dayjs = require("dayjs");
const localeData = require("dayjs/plugin/localeData");
dayjs.extend(localeData);

/**
 * A custom hook to get the language code based on the current locale.
 * The current locale will be stored in the `router.locale` variable.
 * @returns language code
 */
const useGetLanguageCode = () => {
  const { locale } = useRouter();

  const [_, languageCode]: string[] = locale?.split("-") || ["", "en"];

  if (languageCode) {
    return languageCode;
  }
  return "en";
};

export default useGetLanguageCode;

export const getLanguageCodeFromLocale = (locale: string) => {
  const [_, languageCode]: string[] = locale?.split("-") || ["", "en"];

  return languageCode;
};
/**
 * @function capitalizeFirstLetter
 * @description this function is used to change the first letter as capital in the string
 * @param string
 * @returns string with the first letter as capitalized
 */
export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


/**
 * @function getTranslatedWeekday
 * @description this function is used for getting the translated week abbrivated names to display in the calendar
 * @returns array of strings like ['Mon','Tue','Wed','Thu','Fri','Sat'] with tralated in respective language
 */
export const getTranslatedWeekday = () => {
  /**
   * @constant weekdays
   * @description this const stores the days of a week in the array,
   * which will come from the dayjs in the translated language
   */
  const weekdays = Dayjs.weekdaysShort();

  //here we are manupulating the array because from the dayjs we will get as ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  // but we want as ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] for this we are manupulating the retrning fo the array
  return _.concat(_.slice(weekdays, 1), _.first(weekdays)).map((day: any) =>
    // We need the first letter as the capitalized but the day js is not supporting us so that we are manupulating the string
    capitalizeFirstLetter(day)
  );
};

/**
 * @function loadLanguageModule
 * Loads the appropriate Day.js locale module based on the provided language code.
 * This function dynamically imports the locale module for Day.js, which is useful
 * for internationalization (i18n) and localization (l10n) purposes in your application.
 *
 * @param {string} [language='en'] - The language code for which to load the Day.js locale module.
 *                                   Defaults to 'en' (English) if no language is specified.
 *
 * The supported language codes and their corresponding Day.js locale modules are:
 * - 'en' : English
 * - 'ru' : Russian
 * - 'et' : Estonian
 * - 'fi' : Finnish
 * - 'cs' : Czech
 * - 'fr' : French
 * - 'pt' : Portuguese
 *
 * If the provided language code does not match any of the supported codes,
 * the function defaults to importing the 'en' (English) locale module.
 *
 */
export function loadLanguageModule(language = "en") {
  switch (language) {
    case "en":
      import("dayjs/locale/en");
      break;
    case "ru":
      import("dayjs/locale/ru");
      break;
    case "et":
      import("dayjs/locale/et");
      break;
    case "fi":
      import("dayjs/locale/fi");
      break;
    case "cs":
      import("dayjs/locale/cs");
      break;
    case "fr":
      import("dayjs/locale/fr");
      break;
    case "pt":
      import("dayjs/locale/pt");
      break;
    default:
      import("dayjs/locale/en");
      break;
  }
}

/**
 * @function getDateFnsLocaleByActiveLanguage
 * @description this function will recognize the locale of the present language code and returns the locale
 * @param languageCode
 * @returns locale based on the language code
 */
export const getDateFnsLocaleByActiveLanguage = () => {
  const languageCode = useGetLanguageCode();
  if (languageCode === "en") {
    return loc["enUS"];
  } else {
    return Object.values(loc).find(
      (language) => language.code === languageCode
    );
  }
};

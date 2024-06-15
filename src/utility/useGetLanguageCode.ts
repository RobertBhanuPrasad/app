import { useRouter } from "next/router";

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
  return "en"
};

export default useGetLanguageCode;

export const getLanguageCodeFromLocale = (locale: string) => {
  const [_, languageCode]: string[] = locale?.split("-") || ["", "en"];

  return languageCode;
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

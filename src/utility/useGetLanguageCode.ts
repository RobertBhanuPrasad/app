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

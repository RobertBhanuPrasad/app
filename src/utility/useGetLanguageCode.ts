import { useRouter } from "next/router";

/**
 * A custom hook to get the language code based on the current locale.
 * The current locale will be stored in the `router.locale` variable.
 * @returns language code
 */
const useGetLanguageCode = () => {
  const { locale } = useRouter();

  console.log("locale is ", locale);
  const [_, languageCode]: string[] = locale?.split("-") || ["", "en"];

  return languageCode;
};

export default useGetLanguageCode;

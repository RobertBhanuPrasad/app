import { useRouter } from "next/router";

/**
 * A custom hook to get the country code based on the current locale.
 * The current locale will be stored in the `router.locale` variable.
 * @returns country code
 */
const useGetCountryCode = () => {
  const { locale } = useRouter();

  //TODO: this condition we will remove later when we remove public database
  if (locale === "en") {
    return "publuc";
  } else {
    const [countryCode] = locale?.split("-") || ["zz"];
    return countryCode;
  }
};

export default useGetCountryCode;

/**
 * This is a funtion where we call inside functions
 * It can be helpful if we want to use without hooks
 * @param locale the locale ex: zz-en , ir-en etc..,
 * @returns country code
 */
export const getCountryCodeFromLocale = (locale: string) => {
  if (locale === "en") {
    return "publuc";
  } else {
    const [countryCode] = locale?.split("-") || ["zz"];
    return countryCode;
  }
};

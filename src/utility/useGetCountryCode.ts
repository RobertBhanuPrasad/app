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

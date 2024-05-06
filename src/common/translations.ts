import _ from "lodash";
import { useRouter } from "next/router";

/**
 * @constant languageCode
 * @description this is used to get the languge code form the route and helps in the translation // TODO need to integrate the route
 */
export const languageCode = () => {
    const router = useRouter();
    return JSON.stringify(router.locale)
}

/**
 * @function translatedText
 * @description this function is used for the translation purpose
 * if we give the jsonb we will have the language code in the router we will get that and we will use in the function and we will get our text as per the language code we have
 * @param name which is the jsonb object having the language code as the key and respective text as a value
 * @returns value to the respected key which is a string
 */
export const translatedText = (name :  object) => {
return _.get(name,languageCode());
}
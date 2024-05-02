import _ from "lodash";

export const en = "en"

/**
 * @function translatedText
 * @description this function is used for the translation purpose
 * if we give the jsonb we will have the language code in the router we will get that and we will use in the function and we will get our text as per the language code we have
 * @param name which is the jsonb object having the language code as the key and respective text as a value
 * @returns value to the respected key which is a string
 */
export const translatedText = (name :  object) => {
return _.get(name,en);
}

/**
 * @description providing the country code and language code it will set the in locale format based on locale it will return the  corresponding country format
 * @example const number = 123456.789
 * for de-DE locale it returns  123.456,789
 * for en-IN lacale it returns 1,23,456.789
 * @param countryCode 
 * @param languageCode 
 * @returns 
 */
export const getCurrencyFormat = (countryCode: string, languageCode: string) => {
  // to join the language code and country code  inorder to get as locale format
  // from url we get the countryCode-langugeCode[ex:ca-en] format but for locale format we need langugeCode-countryCode[ex:en-ca]
  const locale = languageCode.concat('-', countryCode)
   return new Intl.NumberFormat(locale);
}

/**
 * @description providing the country code, language code and currency code it will set the in locale format based on locale and currency code it will return the  corresponding currency symbol.
 * @example for (ca-en locale) and (EUR currencyCode) it returns '€'
 * @example for (ja-jp locale) and (JPY currencyCode) it returns '￥' 
 * @param countryCode 
 * @param languageCode 
 * @param currencyCode 
 * @returns 
 */
export const getCurrencySymbol = (countryCode: string, languageCode: string, currencyCode='EUR') => {
  // to join the language code and country code  inorder to get as locale format
  // from url we get the countryCode-langugeCode[ex:ca-en] format but for locale format we need langugeCode-countryCode[ex:en-ca]
  const locale = languageCode.concat('-', countryCode)
  return (0).toLocaleString(
    locale,
    {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).replace(/\d/g, '').trim()
}

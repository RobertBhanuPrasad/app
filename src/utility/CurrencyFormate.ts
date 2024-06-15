
/**
 * By providing the locale  it will set the input in corresponding country format
 * @param locale 
 * @param currencyCode 
 * @returns 
 */
export const getCurrencyFormat = (locale: string) => {
   return new Intl.NumberFormat(locale);
}

/**
 * By providing the locale and currencyCode it will give the currencySymbol
 * @param locale 
 * @param currencyCode 
 * @returns 
 */
export const getCurrencySymbol = (locale: string, currencyCode: string) => {
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

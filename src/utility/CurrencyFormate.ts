
/**
 * By providing the locale and currencyCode it will set the input in corresponding country format along with currency code
 * @param locale 
 * @param currencyCode 
 * @returns 
 */
export const getCurrencyFormate = (locale: string, currencyCode: string) => {
   return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'code'
  });
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

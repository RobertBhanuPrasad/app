import { CountryCode } from "libphonenumber-js"
import { useCallback, useEffect, useRef, useState } from "react"

type UseMaskedPhoneNumberArgs = {
  countryCode?: CountryCode
  value?: string
  enforceInternational?: boolean
}

const prefixInternational = (value: string) => {
  if (!value.length) {
    return "+"
  }

  if (value && !value.startsWith("+")) {
    return `+${value}`
  }

  return value
}

export const useMaskedPhoneNumber = ({
  countryCode: initalCountryCode,
  value: initialValue,
  enforceInternational,
}: UseMaskedPhoneNumberArgs = {}) => {
  const libPhoneNumber = useRef<any>()
  const [countries, setCountries] = useState<any[]>()
  const [selectedCountryCode, setSelectedCountryCode] = useState<any>(initalCountryCode ?? "")
  const [value, setValue] = useState<string | undefined>()
  const [validity, setValidity] = useState<undefined | string>()
  const [formattedValue, setFormattedValue] = useState<string>("")
  const [metadata, setMetadata] = useState()

  const updateValues = useCallback(
    (input: string, countryCode: CountryCode | undefined) => {
      if (!libPhoneNumber.current || !countries) {
        return
      }

      let inputValue = enforceInternational ? prefixInternational(input) : input

      const asYouType = new libPhoneNumber.current.AsYouType(selectedCountryCode)
      console.log(asYouType.input(inputValue))
      const guessedCountry = asYouType.getCountry()

      if (enforceInternational) {
        if (guessedCountry) {
          setSelectedCountryCode(guessedCountry)
        } else {
          setSelectedCountryCode("")
        }
      }

      const parsedValue = libPhoneNumber.current.parseIncompletePhoneNumber(inputValue)
      const parsedValueFormatted = libPhoneNumber.current.formatIncompletePhoneNumber(parsedValue, countryCode)

      /**
       * Fix for deleting last charactar when the last
       * character is a special character (")" or "+")
       */
      if (parsedValueFormatted.indexOf(inputValue) === 0 && parsedValueFormatted.length > inputValue.length) {
        const formattedValueFixSpecialCharFix = libPhoneNumber.current.formatIncompletePhoneNumber(
          parsedValue.slice(0, -1),
          countryCode
        )
        setFormattedValue(formattedValueFixSpecialCharFix)
      } else {
        setFormattedValue(parsedValueFormatted)
      }

      setValue(parsedValue)
      setValidity(libPhoneNumber.current.validatePhoneNumberLength(parsedValue))
      const completeMetadata = { ...asYouType.getNumber() }
      delete completeMetadata.metadata
      setMetadata(completeMetadata)
    },
    [countries, enforceInternational, selectedCountryCode]
  )

  const changeCountryCode = useCallback(
    (countryCode: string) => {
      if (enforceInternational) {
        const country = countries?.find((o) => o.code === countryCode)

        if (country?.callingCode) {
          updateValues(`+${country.callingCode}`, undefined)
        }
      }

      setSelectedCountryCode(countryCode)
    },
    [enforceInternational, countries, updateValues]
  )

  const changeInput = useCallback(
    (value: string) => {
      updateValues(value, selectedCountryCode)
    },
    [selectedCountryCode, updateValues]
  )

  useEffect(() => {
    ;(async () => {
      if (!libPhoneNumber.current && !countries) {
        const lib = await import("libphonenumber-js")
        libPhoneNumber.current = lib

        const data: any = await import("./CountryNames")

        setCountries(
          Object.keys(data.default).map((key: string) => ({
            code: key as CountryCode,
            name: data.default[key],
            callingCode: lib.getCountryCallingCode(key as CountryCode),
          }))
        )
      }

      if (initialValue && !value) {
        updateValues(initialValue, initalCountryCode)
      }

      if (!initialValue && !value && initalCountryCode) {
        changeCountryCode(initalCountryCode)
      }
    })()
  }, [
    selectedCountryCode,
    libPhoneNumber,
    value,
    countries,
    initialValue,
    initalCountryCode,
    updateValues,
    changeCountryCode,
  ])

  return {
    value,
    formattedValue,
    updateValue: changeInput,
    updateCountryCode: changeCountryCode,
    countries,
    countryCode: selectedCountryCode,
    validity,
    metadata,
  }
}
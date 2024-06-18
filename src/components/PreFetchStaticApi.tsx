import { supabaseClient } from "src/utility/supabaseClient"

// combining whole db static data in one single object
export const fetchStaticDBData = async() => {
  const countryConfigData = fetchCountryConfigData()

  const timeZoneData = fetchTimeZonesData()
  return await Promise.all([countryConfigData, timeZoneData])
    .then(([countryConfigData, timeZoneData]) => {
      return { countryConfigData, timeZoneData }
    })
    .catch((error) => {
      console.error("Error fetching static DB data", error)
      return { countryConfigData: null, timeZoneData: null }
    })
}

// fetching country config data from db 
export const fetchCountryConfigData = async (): Promise<CountryConfigDataBaseType | null> => {
  const supabase = supabaseClient()

  try {
    const { data: countryConfigData } = await supabase.from("country_config").select("*")

    return countryConfigData?.[0]
  } catch (error) {
    console.error("Error fetching country config data")
    return null
  }
}

// fetching time zones data from db
export const fetchTimeZonesData = async (): Promise<TimeZoneDataBaseType[] | null> => {
  const supabase = supabaseClient()

  try {
    const { data: timeZonesData } = await supabase.from("time_zones").select("*")
    return timeZonesData
  } catch (error) {
    console.error("Error fetching time zones data")
    return null
  }
}

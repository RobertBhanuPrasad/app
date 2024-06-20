import { SupabaseClient, supabaseClient } from "src/utility/supabaseClient"

// combining whole db static data in one single object
export const fetchStaticDBData = async() => {

  const supabase = supabaseClient()

  const countryConfigData = fetchCountryConfigData(supabase)

  const timeZoneData = fetchTimeZonesData(supabase)

  const organizationsData = fetchOrganizationData(supabase)

  return await Promise.all([countryConfigData, timeZoneData, organizationsData])
    .then(([countryConfigData, timeZoneData, organizationsData]) => {

      return { countryConfigData, timeZoneData, organizationsData }

    })  
    .catch((error) => {
      console.error("Error fetching static DB data", error)
      return { countryConfigData: null, timeZoneData: null, organizationsData: null }
    })

}

// fetching country config data from db 
export const fetchCountryConfigData = async (supabase: SupabaseClient): Promise<CountryConfigDataBaseType | null> => {

  try {
    const { data: countryConfigData, error } = await supabase.from("country_config").select("*").single()

    if (error) {
      throw error;  // Throw the error to be caught in the catch block
    }

    return countryConfigData

  } catch (error) {
    console.error("Error fetching country config data",error)
    return null
  }
}

// fetching time zones data from db
export const fetchTimeZonesData = async (supabase: SupabaseClient): Promise<TimeZoneDataBaseType[] | null> => {

  try {
    const { data: timeZonesData, error } = await supabase.from("time_zones").select("*")

    if (error) {
      throw error;  // Throw the error to be caught in the catch block
    }

    return timeZonesData

  } catch (error) {
    console.error("Error fetching time zones data",error)
    return null
  }
}

// fetching organization data from db
export const fetchOrganizationData = async(supabase: SupabaseClient):Promise<OrganizationsDataBaseType[] | null>=>{

  try {
    const { data: organizationsData, error } = await supabase.from("organizations").select("*")

    if (error) {
      throw error;  // Throw the error to be caught in the catch block
    }
    
    return organizationsData

  } catch (error) {
    console.error("Error fetching organizations data",error)
    return null
  }
}

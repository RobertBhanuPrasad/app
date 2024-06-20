import { create } from "zustand";

export interface StaticDataType {
  countryConfigData: CountryConfigDataBaseType | null,
  timeZoneData: TimeZoneDataBaseType[] | null,
  organizationsData: OrganizationsDataBaseType[] | null
}

export interface StaticData {
    staticData: StaticDataType;
    setStaticData: (data: StaticDataType) => void;
}

/**
 * This is a zustand store where if user need any config data we can use this store
 * Advantage of zustand store: 
 * 1. We can call this as a hook and we can get data in functional components
 * 2. We can call this as a function and get data even in normal function calls and on Clicks of a button
 * Where we are using this store
 * 1. We are using this in supabaseClient.ts file because that is normal file it is not a functional component.
 */
export const staticDataStore = create<StaticData>((set)=>({

    /**
     * There is a variable named staticData
     * This variable is a type of object, which store country config data and time zones data
     */
    staticData: {
        countryConfigData: null,
        timeZoneData: null,
        organizationsData: null
    },

    /**
   * This function is used to store country config data and time zones data as single object
   * @param by this is combination of CountryConfigDataBaseType and array of TimeZoneDataBaseType
   * @returns void
   */
    setStaticData: (data) => {
        set({ staticData: data });
    },
}))
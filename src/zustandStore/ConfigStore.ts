import useGetCountryCode from "src/utility/useGetCountryCode";
import useGetLanguageCode from "src/utility/useGetLanguageCode";
import { create } from "zustand";

interface ConfigStore {
  countryCode: string;
  languageCode: string;
  setCountryCode: (countryCode: string) => void;
  setLanguageCode: (languageCode: string) => void;
}

/**
 * This is a zustand store where if user need any config data we can use this store
 * Advantage of zustand store: 
 * 1. We can call this as a hook and we can get data in functional components
 * 2. We can call this as a function and get data even in normal function calls and on Clicks of a button
 * Where we are using this store
 * 1. We are using this in supabaseClient.ts file because that is normal file it is not a functional component.
 */
export const ConfigStore = create<ConfigStore>((set) => ({
  countryCode: "public",
  languageCode: "en",

  setCountryCode: (countryCode: string) => {
    set({ countryCode });
  },

  setLanguageCode: (languageCode: string) => {
    set({ languageCode });
  },
}));

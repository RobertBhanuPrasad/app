import { supabaseClient } from "./supabaseClient";

/**
 * @function getOptionValuesByOptionLabel function is used to get array of option_values with option_labels KEY.
 * @param {string} optionLabelKey - The Key of the option label to search for.
 * @returns {Array} An array of option values matching the provided option label key.
 */
export const getOptionValuesByOptionLabel = async (optionLabelKey: string): Promise<any[] | null> => {
  /*
   * Retrieve data from the 'option_values' table using Supabase client,
   * selecting all fields and inner joining with 'option_labels' table based on matching key.
   */
  const data = await supabaseClient
    .from("option_values")
    .select("*,option_labels!inner(id)")
    .eq("option_labels.key", optionLabelKey)
    .order('order', { ascending: true }); 

  return data?.data; // Return the retrieved data.
};

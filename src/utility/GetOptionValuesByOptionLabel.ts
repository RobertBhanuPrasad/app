import _ from "lodash";
import { optionLabelValueStore } from "src/zustandStore/OptionLabelValueStore";
import { OpenStreetMapProvider } from "leaflet-geosearch";


/**
 * @function GetOptionValuesByOptionLabel function is used to get array of option_values with option_labels KEY.
 * @param {string} optionLabelKey - The Key of the option label to search for.
 * @returns {Array} An array of option values matching the provided option label key.
 */
export const getOptionValuesByOptionLabel = (optionLabelKey: string): any[] => {
  const { optionLabelValue } = optionLabelValueStore();

  return optionLabelValue.filter(
    (val: { key: string }) => val.key == optionLabelKey
  );
};

export const getOptionValueObjectByOptionValue = (optionValue: string): any => {
  const { optionLabelValue } = optionLabelValueStore();

  const foundOptionValue = _.find(optionLabelValue, (val) =>
    _.find(val.option_values, { value: optionValue })
  );

  return foundOptionValue
    ? _.find(foundOptionValue.option_values, { value: optionValue })
    : undefined;
};

export const fetchLongitudeLatitudeData = async (address: string) => {
  const provider = new OpenStreetMapProvider();

  // Fetch location data using leaflet-geosearch package
  const response = await provider.search({
    query: address,
  });

  return response;
};

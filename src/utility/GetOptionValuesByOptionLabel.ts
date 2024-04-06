import _ from 'lodash'
import { optionLabelValueStore } from 'src/zustandStore/OptionLabelValueStore'
// import { OpenStreetMapProvider } from "leaflet-geosearch";

/**
 * @function GetOptionValuesByOptionLabel function is used to get array of option_values with option_labels KEY.
 * @param {string} optionLabelKey - The Key of the option label to search for.
 * @returns {Array} An array of option values matching the provided option label key.
 */
export const getOptionValuesByOptionLabel = (optionLabelKey: string): any[] => {
  const { optionLabelValue } = optionLabelValueStore()

  return optionLabelValue.filter((val: { key: string }) => val.key == optionLabelKey)
}

/**
 * @function getOptionValueObjectByOptionOrder function is used to get object of option_values with option_labels KEY and option_values order.
 * @param {string} optionLabel - The Key of the option label to search for.optionLabel.
 * @param {number} optionOrder - order of option value
 * @returns {object} An object of option values matching the provided key.
 */
export const getOptionValueObjectByOptionOrder = (
  optionLabel: string,
  optionOrder: number
): OptionValuesDataBaseType => {
  const { optionLabelValue } = optionLabelValueStore()

  const foundOptionValue = _.find(optionLabelValue, val => val.key === optionLabel)

  return foundOptionValue ? _.find(foundOptionValue.option_values, { order: optionOrder }) : undefined
}

export const getOptionValueObjectById = (optionLabel: string, id: number): any => {
  const { optionLabelValue } = optionLabelValueStore()
  const foundOptionValue = _.find(optionLabelValue, val => val.key === optionLabel)
  return foundOptionValue ? _.find(foundOptionValue.option_values, { id: id }) : undefined
}

//TODO: Will use this function after completion of MAP Component
// export const fetchLongitudeLatitudeData = async (address: string) => {
//   const provider = new OpenStreetMapProvider();

//   // Fetch location data using leaflet-geosearch package
//   const response = await provider.search({
//     query: address,
//   });

//   return response;
// };

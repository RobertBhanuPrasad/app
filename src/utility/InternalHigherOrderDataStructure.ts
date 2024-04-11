/**
 * The internalHigherOrderDataStructure function is an asynchronous higher-order function that processes a data structure consisting of an array of objects with an associated id property. It applies a modification function (GetApiData) to each object in the array and returns a modified data structure.
 * @param data
 * @param GetApiData
 * @returns ModifiedDataStructure
 */

export const TransformDataStructureWithHigherOrderConversion = (
  data: any,
  retrieveModifiedData: any
) => {
  if (data?.length > 0) {
    const modifiedData: any = data?.map((row: any) => {
      const modifiedRow = retrieveModifiedData(row);
      return modifiedRow;
    });
    return modifiedData;
  } else return data;
};

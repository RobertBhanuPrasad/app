import {
  BaseOption,
  BaseRecord,
  GetListResponse,
  GetManyResponse,
  HttpError,
  UseLoadingOvertimeReturnType,
  UseSelectProps,
  useSelect,
} from '@refinedev/core';

import { QueryObserverResult } from '@tanstack/react-query';
import { get, uniqBy } from 'lodash';

export type UseSelectReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TOption extends BaseOption = BaseOption

> = {
  queryResult: QueryObserverResult<GetListResponse<TData>, TError>;
  defaultValueQueryResult: QueryObserverResult<GetManyResponse<TData>>;
  onSearch: (value: string) => void;
  options: any;
} & UseLoadingOvertimeReturnType;

export const useMVPSelect = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
  TOption extends BaseOption = BaseOption

>(
  props: UseSelectProps<TQueryFnData, TError, TData>
): UseSelectReturnType<TData, TError, TOption> => {
  
  const { options, defaultValueQueryResult, queryResult, ...rest } = useSelect(props);

  /**
   *  Requirement : The performance is slow, causing a poor user experience. To improve performance, we are implementing this code.
   * 
   * Bug no :1432
   * 
   * Implementation : This function `useMVPSelect` uses the `useSelect` hook and fetch the data  Initially, `customOptions` is an empty array. The function then
    maps the results of the `queryResult` and `defaultValueQueryResult` to extract the necessary labels and values. The labels and values from both the query results 
    and default values are combined using the `uniqBy` function.These combined options are then assigned to `customOptions`.
      The function only processes the query results and default values when they are not loading (`isLoading` is false) and have successfully 
       retrieved data (`isSuccess` is true). Finally, `customOptions` is returned as `options`, and that will be passed to select dropdowns

   * @returns
   */

  const customOptions = () => {
   // Execute the queryOptions and defaultOptions only when isLoading is false and isSuccess is true
    if (!queryResult.isLoading && queryResult.isSuccess || !defaultValueQueryResult.isLoading && defaultValueQueryResult.isSuccess ) {
      const queryOptions = queryResult.data?.data.map((item) => ({  // Map the query result data to options
        label: get(item, props.optionLabel as any), // Get label from item using optionLabel
        value: get(item, props.optionValue as any), // Get value from item using optionValue
      })) ?? [];

      const defaultOptions = defaultValueQueryResult.data?.data.map((item) => ({ //Map the default value query result data to options 
        label: get(item, props.optionLabel as any),  // Get label from item using optionLabel
        value: get(item, props.optionValue as any), // Get value from item using optionValue
      })) ?? [];
      return uniqBy([...queryOptions, ...defaultOptions], 'value');  // Combine both queryOptions and defaultOptions ensuring uniqueness by 'value'
    }
  };

  return {
      options: customOptions(),  // Set options to the result of customOptions function
      defaultValueQueryResult,   
      queryResult,
      ...rest,
  };
};
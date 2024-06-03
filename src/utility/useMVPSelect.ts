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

  /**
   *  Requirement : The performance is slow, causing a poor user experience. To improve performance, we are implementing this code.
   * 
   * Bug no :1432
   * 
   * Implementation : Previously, we were mapping options, but initially, `options` was an empty array,
   *  causing a delay in displaying the options. To address this, we now use `queryResult`, which fetches data immediately.
   *  However, changing every instance of `options` to `queryResult` is not ideal. Instead, we introduce `customOptions`, 
   * initially an empty array, which maps `queryResult` and appends it to `options` before returning. 
     The `defaultValueQueryResult` handles scenarios where navigating between pages might cause delays due to selected 
     options not being in the initial set of options. By combining `queryResult` and `defaultValueQueryResult` with the 
    `uniqBy` function, we ensure all options, including selected ones, are readily available. This approach
     optimizes performance and ensures selected options are always visible.

   * @returns
   */

export const useMVPSelect = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
  TOption extends BaseOption = BaseOption
>(
  props: UseSelectProps<TQueryFnData, TError, TData>
): UseSelectReturnType<TData, TError, TOption> => {
  
  const { options, defaultValueQueryResult, queryResult, ...rest } = useSelect(props);

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
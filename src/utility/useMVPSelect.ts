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
import { useMemo } from 'react';
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
  // Combine options from query result and default values, ensuring uniqueness
  const customOptions = useMemo(() => {
      const queryOptions = queryResult.data?.data.map((item) => ({
          label: get(item, props.optionLabel as any),
          value: get(item, props.optionValue as any),
      })) ?? [];
      const defaultOptions = defaultValueQueryResult.data?.data.map((item) => ({
          label: get(item, props.optionLabel as any),
          value: get(item, props.optionValue as any),
      })) ?? [];
      return uniqBy([...queryOptions, ...defaultOptions], 'value');
  }, [queryResult.data, defaultValueQueryResult.data, props.optionLabel, props.optionValue]);
  return {
      options: customOptions,
      defaultValueQueryResult,
      queryResult,
      ...rest,
  };
};





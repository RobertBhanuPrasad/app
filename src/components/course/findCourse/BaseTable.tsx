"use client";

import {
  AccessorColumnDef,
  ColumnDef,
  ColumnDefResolved,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";

import ClearAll from "@public/assets/ClearAll";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";

import DropDown from "@public/assets/DropDown";
import { useTranslation } from "next-i18next";

interface IBaseTable<TData, TValue> {
  /**
   * Columns defined for the table
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * Array of data objects to be displayed in the table
   */
  data: TData[];

  /**
   * Additional CSS classes to apply to the table
   */
  tableStyles?: {
    /**
     * Additional CSS classes to pass to the table container
     */
    table?: string;
    /**
     * Additional CSS classes to pass to each row
     */
    rowStyles?: string;
    /**
     * Additional CSS classes to pass to table container
     */
    tableContainer?: string;
    /**
     * Additional CSS classes to pass to table header
     */
    tableHeader?: string;
  };
  /**
   * When there are no results then we have to show this placeholder
   */
  noRecordsPlaceholder?: string;
  /**

  /**
   * Function to update the current page number
   */
  setCurrent?: (value: React.SetStateAction<number>) => void;

  /**
   * The current page
   */
  current?: number;

  /**
   * Total number of pages
   */
  pageCount?: number;

  /**
   * Function to update the page size
   */
  setPageSize?: (value: React.SetStateAction<number>) => void;

  /**
   * Number of items to display per page
   */
  pageSize?: number;

  /**
   * Total number of items in the dataset
   */
  total?: number;

  /**
   * Flag to indicate whether pagination controls should be displayed
   */
  pagination?: boolean;

  /**
   * Flag to indicate whether checkboxes should be displayed
   */
  checkboxSelection?: boolean;

  /**
   * Flag to indicate whether sticky coulmns should be displayed
   */
  columnPinning?: boolean;

  /**
   * It is used to send the default columns to be selected
   */
  defaultColumns?: string[];

  /**
   * Row selection state
   */
  rowSelection?: RowSelectionState;

  /**
   * Function to update the row selection state to track the selected rows
   */
  setRowSelection?: (value: React.SetStateAction<RowSelectionState>) => void;
  /**
   * Flag to indicate whether the column selector need to be displayed or not
   */
  columnSelector?: boolean;

  noScroll? : boolean;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  tableStyles,
  current,
  setCurrent= () => {},
  pageCount,
  total = 0,
  setPageSize = () => {},
  pageSize=0,
  pagination = false,
  checkboxSelection,
  columnPinning = false,
  defaultColumns = [],
  rowSelection,
  setRowSelection,
  columnSelector,
  noRecordsPlaceholder = "No results",
  noScroll
}: IBaseTable<TData, TValue>) {
  // Initial visibility state for column selector
  const initialColumnVisibilityChanges = columns.reduce(
    (acc: Record<string, boolean>, { accessorKey, enableHiding }: any) => {
      // Determine initial visibility for the current column
      acc[accessorKey] =
        // If the defaultColumns array is empty or includes the current column's accessorKey, set visibility to true
        defaultColumns.length === 0 || defaultColumns.includes(accessorKey)
          ? true
          : // If enableHiding is true for the current column, set visibility to false, otherwise set it to true
          enableHiding
          ? false
          : true;
      return acc;
    },
    {}
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  //Local state for column selector to apply chnages when we click on apply button
  const [columnVisibilityChanges, setColumnVisibilityChanges] =
    useState<VisibilityState>(initialColumnVisibilityChanges);

  //initial state for select all checkbox
  const initialSelectAll =
    Object.keys(columnVisibilityChanges).length > 0 &&
    Object.values(columnVisibilityChanges).every(Boolean);

  const [selectAll, setSelectAll] = useState(initialSelectAll);

  /**
   * @function getRowId
   * @description this function return id if the row have the id else it will return the index as id
   * @param originalRow
   * @param index
   * @returns index in string format
   */
  const getRowId = (originalRow: any, index: number) => {
    if (checkboxSelection) {
      return originalRow.id.toString();
    } else {
      return index.toString();
    }
  };
  // table hook
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  /**
   * Function to handle the select all checkbox changes
   */
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);

    const newColumnVisibilityChanges: VisibilityState = {};

    //Logic for not uncheck the columns which cannot be hidden they should be always true
    Object.keys(columnVisibilityChanges).forEach((columnId) => {
      const column = columns?.find(
        (column: any) => column.accessorKey === columnId
      );
      const canHide = column?.enableHiding;
      newColumnVisibilityChanges[columnId] = canHide === false ? true : checked;
    });

    setColumnVisibilityChanges(newColumnVisibilityChanges);
  };

  /**
   * function to handle the columns in column selector
   */
  const handleColumnVisibilityChange = (
    columnId: string,
    isVisible: boolean
  ) => {
    setColumnVisibilityChanges((prevState) => ({
      ...prevState,
      [columnId]: isVisible,
    }));

    // when i uncheck the individual check box we need to see if all checkboxes or checked or not and we have to update the select all
    const allChecked = Object.values({
      ...columnVisibilityChanges,
      [columnId]: isVisible,
    }).every(Boolean);
    setSelectAll(allChecked);
  };

  /**
   * function to handle the columns in column selector
   */
  const applyColumnVisibilityChanges = () => {
    table.setColumnVisibility(columnVisibilityChanges);
    setOpen(false);
  };

  /**
   * functions to clear the columns in column selector
   */
  const clearColumnVisibilityChanges = () => {
    const finalColumnVisibilityChanges = columns.reduce(
      (acc: Record<string, boolean>, column: any) => {
        //When clearing we need to make sure that columns which are not been hidden need to be true always
        if (column.accessorKey) {
          if (column.enableHiding == false) {
            acc[column.accessorKey] = true;
          } else {
            acc[column.accessorKey] = false;
          }
        }
        return acc;
      },
      {}
    );
    setColumnVisibilityChanges(finalColumnVisibilityChanges);
    setSelectAll(false);
  };

  const [scrollLeft, setScrollLeft] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  /**
   * function to move the scroll bar to left using controls in action
   */
  const handlePrevButtonClick = () => {
    if (tableRef.current) {
      tableRef.current.scrollLeft -= 100;
      setScrollLeft(tableRef.current.scrollLeft);
    }
  };

  /**
   * function to move the scroll bar to right using controls in action
   */
  const handleNextButtonClick = () => {
    if (tableRef.current) {
      tableRef.current.scrollLeft += 100;
      setScrollLeft(
        tableRef.current.scrollWidth - tableRef.current.clientWidth
      );
    }
  };

  //state variable to control the opening and closing of the column selector
  const [open, setOpen] = useState(false);
  const {t} = useTranslation(['common', "course.find_course", "new_strings"])
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center max-h-[50px]">
        {columnSelector && (
          <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  className="flex flex-row justify-between w-[192px] h-10  hover:border-solid hover:border hover:border-[1px] hover:border-[#7677F4]"
                >
                  {t('course.find_course:columns')}
                  <DropDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[192px]" align="start">
                <div>
                  <div className="flex flex-col gap-4 p-3 max-h-[300px] overflow-y-auto scrollbar text-[#333333]">
                    <div className="flex flex-row gap-4 items-center">
                      <Checkbox
                        className="w-6 h-6 border-[1px] !border-[#D0D5DD] rounded-lg"
                        checked={selectAll}
                        onCheckedChange={handleSelectAllChange}
                      />
                      <div className="font-bold text-[14px]">{t('course.find_course:select_all')}</div>
                    </div>
                    {table
                      .getAllColumns()
                      .filter((column) => column?.accessorFn)
                      // Here we are filtering the columns which have accessorKey
                      .map((column: any,index:number) => {
                        if (!column.getCanHide()) {
                          //display the disabled options
                          return (
                            <div className="flex flex-row gap-4 items-center" key={index}>
                              <Checkbox
                                key={column.id}
                                disabled={!column.getCanHide()}
                                //Disabling the checkbox if the column cannot be hidden
                                className="w-6 h-6 border-[1px] !border-[#D0D5DD] rounded-lg"
                                checked={columnVisibilityChanges[column.id]}
                                onCheckedChange={(value: boolean) => {
                                  handleColumnVisibilityChange(
                                    column.id,
                                    value
                                  );
                                }}
                              />
                              {column?.columnDef?.column_name}
                            </div>
                          );
                        }
                      })}
                    {table
                      .getAllColumns()
                      .filter(
                        (column) => column?.accessorFn && column.getCanHide()
                      )
                      // Here we are filtering the columns which have accessorKey
                      .map((column: any) => {
                        // display the enabled options
                        return (
                          <div className="flex flex-row gap-4 items-center">
                            <Checkbox
                              key={column.id}
                              className="w-6 h-6 border-[1px] !border-[#D0D5DD] rounded-lg"
                              checked={columnVisibilityChanges[column.id]}
                              onCheckedChange={(value: boolean) => {
                                handleColumnVisibilityChange(column.id, value);
                              }}
                            />
                            {column?.columnDef?.column_name}
                          </div>
                        );
                      })}
                  </div>

                  <div className="flex flex-row gap-4 p-2 w-full items-center ">
                    <div
                      onClick={clearColumnVisibilityChanges}
                      className="flex flex-row gap-2 items-center cursor-pointer text-sm font-semibold text-[#7677F4]"
                    >
                      <ClearAll />
                      <div className="hover:text-[#5E5FC3]">{t('clear_all')}</div>
                    </div>
                    <Button
                      onClick={applyColumnVisibilityChanges}
                      className="h-9 w-18 rounded-xl hover:bg-[#5E5FC3]"
                    >
                      {t('apply_button')}
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {/* column selector  */}

        {/* If pagination set true then we have to show pagination  */}
        <div>
          {pagination &&total > pageSize  &&(
            <DataPagination
              setCurrent={setCurrent}
              current={current}
              pageCount={pageCount}
              total={total}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div>
        <div className="border border-[1px] overflow-hidden rounded-xl">
          <div
            ref={tableRef}
            className={`w-full ${tableStyles?.tableContainer} overflow-auto scrollbar`}
          >
            <Table className={`${tableStyles?.table}`}>
              <TableHeader
                className={`bg-[#7677F41B] w-full ${tableStyles?.tableHeader}`}
              >
                {table &&
                  table?.getHeaderGroups()?.map((headerGroup) => (
                    <TableRow
                      className="border-none text-[16px] font-bold w-full"
                      key={headerGroup?.id}
                    >
                      {/* If the checkboxSelection is true then we need to show checkboxes  */}
                      {checkboxSelection && (
                        <TableHead
                          className={`${
                            columnPinning && "sticky left-0 bg-[#F1F1FE]"
                          }`}
                        >
                          <Checkbox
                            className="w-6 h-6 border-[1px] !border-[#D0D5DD] rounded-lg"
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value: boolean) => {
                              table.toggleAllPageRowsSelected(value);
                            }}
                            aria-label="Select all"
                          />
                        </TableHead>
                      )}
                      {headerGroup?.headers?.map((header, index) => {
                        return (
                          <TableHead
                            //If we have column pinning true then we have to make the first and last column sticky
                            className={`${
                              columnPinning &&
                              index === 0 &&
                              `sticky ${
                                checkboxSelection ? "left-10" : "left-0"
                              }  bg-[#F1F1FE] drop-shadow-right`
                            } ${
                              !noScroll && columnPinning &&
                              index === headerGroup.headers.length - 1 &&
                              `sticky right-0 bg-[#F1F1FE] drop-shadow-left w-[50px]`
                            } text-[#333333] `}
                            key={header?.id}
                          >
                            {header?.isPlaceholder
                              ? null
                              : flexRender(
                                  header?.column?.columnDef?.header,
                                  header?.getContext()
                                )}

                            {!noScroll && index === headerGroup.headers.length - 1 &&
                              columnPinning && (
                                <div className="flex flex-row gap-2">
                                  <ChevronLeft
                                    onClick={handlePrevButtonClick}
                                    className="size-6 cursor-pointer mr-2 bg-[white] text-[#7677F4] rounded-full"
                                  />
                                  <ChevronRight
                                    onClick={handleNextButtonClick}
                                    className="size-6 cursor-pointer bg-[#7677F4] text-[white] rounded-full"
                                  />
                                </div>
                              )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                {table && table?.getRowModel()?.rows?.length ? (
                  table?.getRowModel()?.rows?.map((row) => (
                    <TableRow
                      className={`{${tableStyles?.rowStyles}`}
                      key={row?.id}
                      // data-state={row?.getIsSelected() && "selected"}
                    >
                      {/* If the checkboxSelection is true then we need to show checkboxes  */}
                      {checkboxSelection && (
                        <TableCell
                          className={`${
                            columnPinning && "sticky left-0 bg-[#FFFFFF] "
                          }`}
                        >
                          <Checkbox
                            className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
                            checked={row?.getIsSelected()}
                            onCheckedChange={(value) =>
                              row?.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                          />
                        </TableCell>
                      )}

                      {row?.getVisibleCells().map((cell, index) => (
                        //If we have column pinning true then we have to make the first and last column sticky
                        <TableCell
                          className={` ${
                            columnPinning &&
                            index === 0 &&
                            `sticky ${
                              checkboxSelection ? "left-10" : "left-0"
                            }  top-0 bg-[#FFFFFF] drop-shadow-right`
                          } ${
                            !noScroll && columnPinning &&
                            index === row.getVisibleCells().length - 1 &&
                            `sticky right-0 top-0 bg-[#FFFFFF] w-[50px] drop-shadow-left`
                          } text-[#333333]`}
                          key={cell.id}
                        >
                          {flexRender(
                            cell?.column?.columnDef?.cell,
                            cell?.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns?.length}
                      className="h-24 text-left"
                    >
                      {noRecordsPlaceholder}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {pagination && (
          <div className="flex justify-center mt-[24px]">
            <DataPagination
              setCurrent={setCurrent}
              current={current}
              pageCount={pageCount}
              total={total}
              pageSize={pageSize}
            />
            {total>=10 &&  
            <div className="absolute mt-3 mr-6 right-0 to flex items-center space-x-2 ml-auto  flex-row self-center">
              <Select
                value={pageSize}
                onValueChange={(value) => {
                  setCurrent(1)
                  setPageSize(Number(value));
                  table?.setPageSize(Number(value));
                }}
              >
              <SelectTrigger className="h-8 w-[131px]">
                  <div className="text-[#666666]">{t('course.find_course:showing')}</div>
                  <SelectValue/>
              </SelectTrigger>
                <SelectContent side="top">
                 {/* Updated pageSize options to include [10, 25, 50, 100]. */}
                  {[10, 25, 50, 100].map(
                    (
                      pageSize // Till now there is no limit will change after confirming TODO
                    ) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <div className="text-[14px] font-normal">{t('course.find_course:of')} {total}</div>
            </div>}
          </div>
        )}
      </div>
    </div>
  );
}

interface DataPaginationProps {
  setCurrent?: (value: React.SetStateAction<number>) => void;
  current?: number;
  pageCount?: number;
  total?: number;
  pageSize?:number
}

const DataPagination = ({
  setCurrent = () => {},
  total = 0,
  current = 1,
  pageCount = 1,
  pageSize=0
}: DataPaginationProps) => {
  const PagesArray = [];
  const DOTS = ". . .";
  if (pageCount <= 4) {
    // If there are 4 or fewer pages, show all pages without ellipses
    for (let i = 1; i <= pageCount; i++) {
      PagesArray.push(i);
    }
  } else {
    if (current <= 3) {
      // If current page is 4 or less, show pages 1 to 4, then ellipses, then last page
      PagesArray.push(1, 2, 3, 4, DOTS, pageCount);
    } else if (current >= pageCount - 2) {
      // If current page is near the end, show first page, ellipses, and last 4 pages
      PagesArray.push(
        1,
        DOTS,
        pageCount - 3,
        pageCount - 2,
        pageCount - 1,
        pageCount
      );
    } else {
      // Otherwise,first page , ellipses, current page, ellipses, and last page
      PagesArray.push(
        1,
        DOTS,
        current - 1,
        current,
        current + 1,
        DOTS,
        pageCount
      );
    }
  }

const {t} = useTranslation(["common", "new_strings"])

  return (
    <div className="flex flex-row self-center items-center text-[13px] space-x-2 p-2">
      {/* prev button */}
      {/* Check if there are more than one page, and if so, display a button for navigating to the previous page. */}
      {pageCount > 1 && (
        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-none text-[13px]"
          onClick={() => setCurrent(current - 1)}
          disabled={current <= 1}
        >
          <div className="text-[#D6D7D8] font-semibold">{t('new_strings:prev')}</div>
        </Button>
      )}
      {/* pages buttons */}
      {total > pageSize &&
        PagesArray.map((page: any, index: any) => (
          <div key={index}>
            {/* Check if the current page is a placeholder for ellipsis.If yes, display the ellipsis.Otherwise, display a button for the page. */}
            {page === DOTS ? (
              <span className="p-2 text-[13px]">{DOTS}</span>
            ) : (
              <Button
                variant={page === current ? "default" : "outline"}
                onClick={() => {
                  setCurrent(page);
                }}
                className={`h-8 w-8 text-[13px] p-0 ${page === current ? 'hover:bg-[#5E5FC3]' : 'hover:border-solid hover:border-[1px] hover:border-[#7677F4]'}`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      {/* next button */}
      {/* Check if there are more than one page, and if so, display a button for navigating to the next page. */}
      {pageCount > 1 && (
        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-none text-[13px]"
          onClick={() => setCurrent(current + 1)}
          disabled={current >= pageCount}
        >
          <div>{t('next')}</div>
        </Button>
      )}
    </div>
  );
};

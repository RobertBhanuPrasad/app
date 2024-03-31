"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

import React, { useRef, useState } from "react";
import { Button } from "src/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import ClearAll from "@public/assets/ClearAll";
import { Checkbox } from "src/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";

import DropDown from "@public/assets/DropDown";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableStyles?: string;
  setCurrent: (value: React.SetStateAction<number>) => void;
  current: number;
  pageCount: number;
  setPageSize: (value: React.SetStateAction<number>) => void;
  pageSize: number;
  total: number;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  tableStyles,
  current,
  setCurrent,
  pageCount,
  total,
  setPageSize,
  pageSize,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
  });

  const [scrollLeft, setScrollLeft] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrevButtonClick = () => {
    if (tableRef.current) {
      tableRef.current.scrollLeft -= 100;
      setScrollLeft(tableRef.current.scrollLeft);
    }
  };

  const handleNextButtonClick = () => {
    if (tableRef.current) {
      tableRef.current.scrollLeft += 100;
      setScrollLeft(
        tableRef.current.scrollWidth - tableRef.current.clientWidth
      );
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div>
          <DropdownMenu open={open}>
            <DropdownMenuTrigger asChild>
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="flex flex-row justify-between w-[192px] h-10"
              >
                Columns
                <DropDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div>
                <div className="flex flex-col gap-4 p-3 max-h-[300px] overflow-y-auto scrollbar text-[#333333]">
                  <div className="flex flex-row gap-4 items-center">
                    <Checkbox
                      className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
                      checked={table.getIsAllColumnsVisible()}
                      onCheckedChange={table.getToggleAllColumnsVisibilityHandler()}
                    />
                    <div className="font-bold text-[14px]">Select All</div>
                  </div>

                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <div className="flex flex-row gap-4 items-center">
                          <Checkbox
                            key={column.id}
                            className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          />
                          {column.id}
                        </div>
                      );
                    })}
                </div>

                <div className="flex flex-row gap-4 p-2 w-full items-center ">
                  <div className="flex flex-row gap-2 items-center text-sm font-semibold text-[#7677F4]">
                    <ClearAll />
                    <div>Clear All</div>
                  </div>
                  <Button className="h-9 w-18 rounded-xl">Apply</Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <DataPagination
            setCurrent={setCurrent}
            current={current}
            pageCount={pageCount}
          />
        </div>
      </div>
      <div>
        <Table className={`${tableStyles}`}>
          {/* <div
            ref={tableRef}
            className={` max-w-[${tableStyles}] overflow-x-auto scrollbar`}
          > */}
            <TableHeader className="bg-[#7677F41B]">
              {table &&
                table?.getHeaderGroups()?.map((headerGroup) => (
                  <TableRow
                    className="border-none text-[16px] font-bold"
                    key={headerGroup?.id}
                  >
                    {headerGroup?.headers?.map((header, index) => {
                      return (
                        <TableHead
                        className="text-[#333333]"
                          // className={`${
                          //   index === 0 ? "sticky left-0 z-10" : ""
                          // } ${
                          //   index === headerGroup.headers.length - 1
                          //     ? "sticky right-0 z-10 text-[#333333]"
                          //     : ""
                          // } text-[#333333]`}
                          key={header?.id}
                        >
                          {header?.isPlaceholder
                            ? null
                            : flexRender(
                                header?.column?.columnDef?.header,
                                header?.getContext()
                              )}
                          {index === headerGroup.headers.length - 1 && (
                            <div className="flex flex-row gap-2">
                              <ArrowLeft
                                onClick={handlePrevButtonClick}
                                className="h-4 w-4 cursor-pointer mr-2"
                              />
                              <ArrowRight
                                onClick={handleNextButtonClick}
                                className="h-4 w-6 cursor-pointer"
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
                    key={row?.id}
                    data-state={row?.getIsSelected() && "selected"}
                  >
                    {row?.getVisibleCells().map((cell, index) => (
                      <TableCell
                        // className={`${
                        //   index === 0 ? "sticky left-0 bg-[#FFFFFF] " : ""
                        // } ${
                        //   index === row.getVisibleCells().length - 1
                        //     ? "sticky right-0 top-0 bg-[#FFFFFF] z-10"
                        //     : ""
                        // } text-[#333333]`}
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
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          {/* </div> */}
        </Table>
        <div className="flex flex-row justify-between">

          <DataPagination
            setCurrent={setCurrent}
            current={current}
            pageCount={pageCount}
          />
          <div className="flex items-center space-x-2">
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[131px]">
                <SelectValue placeholder={`${pageSize} jhgf`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    Showing {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>of {total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DataPaginationProps {
  setCurrent: (value: React.SetStateAction<number>) => void;
  current: number;
  pageCount: number;
}

const DataPagination = ({
  setCurrent,
  current,
  pageCount,
}: DataPaginationProps) => {
  return (
    <div className="flex flex-row self-center items-center space-x-2 p-2">
      <Button
        variant="outline"
        className="h-8 w-8 p-0 border-none"
        onClick={() => setCurrent(current - 1)}
        disabled={current <= 1}
      >
        <div>Prev</div>
      </Button>
      {[1, 2, 3, 4, 10].map((page, index, array) => (
        <div key={index}>
          <Button
            variant={page === current ? "default" : "outline"}
            onClick={() => setCurrent(page)}
            disabled={page > pageCount}
          >
            {page}
          </Button>
          {index === 3 && array.length > 4 && <span className="p-2">...</span>}
        </div>
      ))}
      <Button
        variant="outline"
        className="h-8 w-8 p-0 border-none"
        onClick={() => setCurrent(current + 1)}
        disabled={pageCount < current + 1}
      >
        <div>Next</div>
      </Button>
    </div>
  );
};

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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "src/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableStyles?: any;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  tableStyles,
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
     setScrollLeft(tableRef.current.scrollWidth - tableRef.current.clientWidth);
   }
 };


  return (
    <div className="flex flex-col gap-4">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <Table className={`${tableStyles} w-full`}>
          <div
            ref={tableRef}
            className="w-full"
          >
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
                          className={`${
                            index === 0
                              ? "sticky left-0 z-10"
                              : ""
                          } ${
                            index === headerGroup.headers.length - 1
                              ? "sticky right-0 z-10 text-[#333333]"
                              : ""
                          } text-[#333333]`}
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
                        className={`${
                          index === 0 ? "sticky left-0 bg-[#FFFFFF] " : ""
                        } ${
                          index === row.getVisibleCells().length - 1
                            ? "sticky right-0 top-0 bg-[#FFFFFF] z-10"
                            : ""
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
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </div>
        </Table>
      </div>
    </div>
  );
}

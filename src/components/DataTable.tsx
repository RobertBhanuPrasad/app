"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/ui/table";

import React, { useState } from "react";

import { Checkbox } from "src/ui/checkbox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setCurrent?: any;
  pageCount?: any;
  current?: any;
  setPageSize?: any;
  pageSize?: any;
  tableStyles?: any;
  showEarlyBirdFees?: any;
}

export function DataTable<TData, TValue>({
  columns: initialColumns,
  data,
  tableStyles,
  setCurrent,
  pageCount,
  current,
  showEarlyBirdFees,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  // Define columns dynamically based on checkbox state
  const tableColumns: any =  showEarlyBirdFees
    ? initialColumns
    : initialColumns.filter(
        (column: any) =>
          column.accessorKey !== "earlynormalfee" &&
          column.accessorKey !== "earlyvatfee" &&
          column.accessorKey !== "earlytotalfee"
      );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table className={tableStyles}>
          <TableHeader className="bg-[#7677F41B]">
            {table &&
              table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow
                  className="border-none text-[16px] font-bold"
                  key={headerGroup?.id}
                >
                  {headerGroup?.headers?.map((header) => {
                    return (
                      <TableHead className="text-[#333333]" key={header?.id}>
                        {header?.isPlaceholder
                          ? null
                          : flexRender(
                              header?.column?.columnDef?.header,
                              header?.getContext()
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
                  {row?.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  colSpan={initialColumns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

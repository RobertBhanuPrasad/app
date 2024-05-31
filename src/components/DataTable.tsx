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
import { useTranslation } from "next-i18next";

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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableStyles,
  setCurrent,
  pageCount,
  current,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation(["new_strings"]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <Table className={tableStyles}>
        <TableHeader className="bg-[#7677F41B]">
          {table &&
            table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow
                className="border-none text-sm font-bold"
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
                  <TableCell key={cell.id} className="font-normal">
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
              <TableCell colSpan={columns?.length} className="h-24 text-center">
                {t("new_strings:no_results")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

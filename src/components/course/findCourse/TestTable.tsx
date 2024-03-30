import React, { useState } from "react";
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
} from "../../../ui/table";
import { Checkbox } from "src/ui/checkbox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableStyles?: any;
}

export function TestTable<TData, TValue>({
  columns,
  data,
  tableStyles,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      columnPinning: {
        left: ["select"], // Provide the ID of the first column you want to pin
        right: ["actions"], // Provide the ID of the last column you want to pin
      },
    },
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
                      <TableHead
                        className="text-[#333333]"
                        key={header?.id}
                        style={{
                          position:
                            header?.id === "select" || header?.id === "actions"
                              ? "sticky"
                              : "static",
                          left: header?.id === "select" ? 0 : undefined,
                          right: header?.id === "actions" ? 0 : undefined,
                          zIndex:
                            header?.id === "select" || header?.id === "actions"
                              ? 1
                              : undefined,
                        }}
                      >
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
                    <TableCell
                      style={{
                        position:
                          cell?.id === "select" || cell?.id === "actions"
                            ? "sticky"
                            : "static",
                        left: cell?.id === "select" ? 0 : undefined,
                        right: cell?.id === "actions" ? 0 : undefined,
                        zIndex:
                          cell?.id === "select" || cell?.id === "actions"
                            ? 1
                            : undefined,
                      }}
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
        </Table>
      </div>
    </div>
  );
}

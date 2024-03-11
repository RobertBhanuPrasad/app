import { DataTable } from "../../DataTable";
import React from "react";
export default function CourseTable() {
  const data: Payment[] = [
    {
      feelevel: "low",
      normalfee: 10,
      vatfee: 2,
      totalfee: 12,
      earlynormalfee: 8,
      earlyvatfee: 1.6,
      earlytotalfee: 9.6,
    },
    {
      feelevel: "medium",
      normalfee: 20,
      vatfee: 4,
      totalfee: 24,
      earlynormalfee: 16,
      earlyvatfee: 3.2,
      earlytotalfee: 19.2,
    },
    {
      feelevel: "high",
      normalfee: 30,
      vatfee: 6,
      totalfee: 36,
      earlynormalfee: 24,
      earlyvatfee: 4.8,
      earlytotalfee: 28.8,
    },
    {
      feelevel: "low",
      normalfee: 15,
      vatfee: 3,
      totalfee: 18,
      earlynormalfee: 12,
      earlyvatfee: 2.4,
      earlytotalfee: 14.4,
    },
    {
      feelevel: "medium",
      normalfee: 25,
      vatfee: 5,
      totalfee: 30,
      earlynormalfee: 20,
      earlyvatfee: 4,
      earlytotalfee: 24,
    },
  ];

  const { fields } = useFieldArray({
    name: "fees",
  });

  console.log("heyy fees", fields);

  return (
    <div className="w-fit">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

CourseTable.noLayout = false;

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "src/ui/checkbox";
import { useFieldArray } from "react-hook-form";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  feelevel: string;
  normalfee: number;
  vatfee: number;
  totalfee: number;
  earlynormalfee?: number;
  earlyvatfee?: number;
  earlytotalfee?: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: () => <div>Enable fees</div>,
    cell: ({ row }) => (
      <Checkbox
        className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "feelevel",
    header: "Fee Level",
  },
  {
    accessorKey: "normalfee",
    header: "Normal Fee",
  },
  {
    accessorKey: "vatfee",
    header: "Vat Fee",
  },
  {
    accessorKey: "totalfee",
    header: "Total Fee",
  },
  {
    accessorKey: "earlynormalfee",
    header: "Early Normal Fee",
  },
  {
    accessorKey: "earlyvatfee",
    header: "Early Vat Fee",
  },
  {
    accessorKey: "earlytotalfee",
    header: "Early Total Fee",
  },
];

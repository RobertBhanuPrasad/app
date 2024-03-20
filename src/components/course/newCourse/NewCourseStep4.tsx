import { DataTable } from "../../DataTable";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "src/ui/checkbox";
import { supabaseClient } from "src/utility";

// Define CourseTable component
export default function CourseTable() {
  const [showColumns, setShowColumns] = useState(false); // State to manage showing extra columns

  // Data for the table
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
      normalfee: 10,
      vatfee: 2,
      totalfee: 12,
      earlynormalfee: 8,
      earlyvatfee: 1.6,
      earlytotalfee: 9.6,
    },
  ];

  // Define columns dynamically based on checkbox state
  const columns: ColumnDef<Payment>[] = [
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
    // Conditional rendering of additional columns based on showColumns state
    ...(showColumns
      ? [
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
        ]
      : []),
  ];

  const fetchFeeData = async () => {
    const { data, error } = await supabaseClient.functions.invoke(
      "course-fee",
      {
        method: "POST",
        body: {
          state_id: "1",
          city_id: "1",
          center_id: "1",
          start_date: "2024-03-18T07:00:00-00:00",
          program_type_id: "1",
        },
      }
    );
    console.log(data, "course fee is", error);
  };

  useEffect(() => {
    fetchFeeData();
  }, []);

  // JSX returned by the component
  return (
    <div className="px-8 flex flex-col justify-center">
      {/* Checkbox to toggle showing extra columns */}
      <div className="flex justify-end items-center gap-2 py-4">
        <Checkbox
          checked={showColumns}
          onCheckedChange={(val) => setShowColumns((prev) => !prev)}
          className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
        />
        <div>Enable early bird fees?</div>
      </div>
      {/* Rendering DataTable component */}
      <DataTable tableStyles="w-[1100px]" columns={columns} data={data} />
    </div>
  );
}

// Property to prevent layout being removed during page transitions
CourseTable.noLayout = false;

// Define Payment type
export type Payment = {
  feelevel: string;
  normalfee: number;
  vatfee: number;
  totalfee: number;
  earlynormalfee?: number;
  earlyvatfee?: number;
  earlytotalfee?: number;
};

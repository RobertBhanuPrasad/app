"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  course_code?: string | null;
  course_type_id?: string | null;
  format_id?: string | null;
  visibility_id?: string | null;
  status_id?: string | null;
  course_start_date?: string | null;
  course_end_date?: string | null;
  course_link?: string | null;
  course_landing_page_link?: string | null;
  course_registration_link?: string | null;
  region_id?: string | null;
  country_id?: number | null;
  state_id?: string | null;
  city_id?: string | null;
  center_id?: string | null;
  contact_name?: string | null;
  contact_mobile?: string | null;
  contact_email?: string | null;
  organizer_user_id?: string | null;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "course_start_date",
    header: "course_start_date",
  },
  {
    accessorKey: "contact_name",
    header: "contact_name",
  },
  {
    accessorKey: "contact_email",
    header: "contact_email",
  },
  {
    accessorKey: "contact_mobile",
    header: "contact_mobile",
  },
  {
    accessorKey: "center",
    header: () => <div>center</div>,
    cell: ({ row }) => {
      const center: any = row.getValue("center");

      return <div>{center?.name}</div>;
    },
  },
  {
    accessorKey: "state",
    header: () => <div>State</div>,
    cell: ({ row }) => {
      const state: any = row.getValue("state");
      return <div>{state?.name}</div>;
    },
  },
  {
    accessorKey: "categoryMaster",
    header: () => <div>Course_type</div>,
    cell: ({ row }) => {
      const data: any = row.getValue("categoryMaster");
      return <div>{data?.category_value}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Course</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

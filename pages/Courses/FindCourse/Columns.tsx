import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from "lucide-react";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";

interface Program {
  id: number;
  created_at: string;
  organization_id: number;
  venue_id: number | null;
  registration_link: string | null;
  program_code: string | null;
  program_fee_settings_id: number | null;
  program_type_id: number;
  status_id: number | null;
  accommodation_fee_payment_mode: number | null;
  center_id: number | null;
  city_id: number | null;
  details_page_link: string | null;
  is_early_bird_enabled: boolean;
  is_residential_program: boolean | null;
  program_alias_name_id: number | null;
  program_created_by: number;
  state_id: number | null;
  use_default_fee: boolean | null;
}

interface CustomColumnDef<T> {
  pinPosition?: string;
}

// Use an intersection type to combine with ColumnDef
type ExtendedColumnDef<T> = CustomColumnDef<T> & ColumnDef<T>;

export const columns: ExtendedColumnDef<Program>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="w-[50px]">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(value)
          }
          aria-label="Select all"
        />
      </div>
    ),

    cell: ({ row }) => (
      <div className="w-[50px]">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    pinPosition: "left",
  },

  {
    accessorKey: "state_id",
    enablePinning: true,
    header: ({ column }) => {
      return (
        <div className="w-[100px]">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            State
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      );
    },

    cell: ({ row }: any) => {
      return <div className="w-[100px]">{row?.original?.state_id?.name}</div>;
    },
  },
  {
    accessorKey: "program_type_id",
    header: () => {
      return <div>Course Name</div>;
    },

    cell: ({ row }: any) => {
      return (
        <div className="lowercase">{row?.original?.program_type_id?.name}</div>
      );
    },
  },
  {
    accessorKey: "state_id",
    enablePinning: true,
    header: ({ column }) => {
      return (
        <div className="w-[100px]">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            State
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      );
    },

    cell: ({ row }: any) => {
      return <div className="w-[100px]">{row?.original?.state_id?.name}</div>;
    },
  },
  {
    accessorKey: "program_type_id",
    header: () => {
      return <div>Course Name</div>;
    },

    cell: ({ row }: any) => {
      return (
        <div className="lowercase">{row?.original?.program_type_id?.name}</div>
      );
    },
  },
  {
    accessorKey: "state_id",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div className="w-[100px]">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            State
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      );
    },

    cell: ({ row }: any) => {
      return <div className="w-[100px]">{row?.original?.state_id?.name}</div>;
    },
  },
  {
    accessorKey: "program_type_id",
    header: () => {
      return <div>Course Name</div>;
    },

    cell: ({ row }: any) => {
      return (
        <div className="lowercase">{row?.original?.program_type_id?.name}</div>
      );
    },
  },
  {
    accessorKey: "state_id",
    enablePinning: true,
    header: ({ column }) => {
      return (
        <div className="w-[100px]">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            State
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      );
    },

    cell: ({ row }: any) => {
      return <div className="w-[100px]">{row?.original?.state_id?.name}</div>;
    },
  },
  {
    accessorKey: "program_type_id",
    header: () => {
      return <div>Course Name</div>;
    },

    cell: ({ row }: any) => {
      return (
        <div className="lowercase">{row?.original?.program_type_id?.name}</div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
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
            <DropdownMenuItem>Copy course</DropdownMenuItem>
            <DropdownMenuItem>Edit Course</DropdownMenuItem>
            <DropdownMenuItem>View Course</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

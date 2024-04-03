import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from "lucide-react";
import { Button } from "src/ui/button";
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
  venue_id: number;
  registration_link: string;
  program_code: string;
  program_fee_settings_id: number;
  program_type_id: number;
  status_id: number;
  accommodation_fee_payment_mode: number | null;
  center_id: number;
  city_id: number;
  details_page_link: string;
  is_early_bird_enabled: boolean;
  is_residential_program: boolean;
  program_alias_name_id: number;
  program_created_by: number;
  state_id: number;
  use_default_fee: boolean;
}

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: "state_id",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
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

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return <div>{row?.original?.state_id?.name}</div>;
    },
  },
  {
    accessorKey: "program_type_id",
    header: () => {
      return <div className=" text-center">Course</div>;
    },

    cell: ({ row }: any) => {
      return (
        <div className="lowercase text-center">
          {row?.original?.program_type_id?.name}
        </div>
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

import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { Button } from "src/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";

export const columns: ColumnDef<ProgramDataBaseType>[] = [
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

    cell: ({ row }) => {
      return (
        <div>
          <div>
            {typeof row?.original?.state_id !== "number" &&
              row?.original?.state_id?.name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "program_type_id",
    header: () => {
      return <div className=" text-center">Course</div>;
    },

    cell: ({ row }) => {
      return (
        <div className="lowercase text-center">
          {typeof row?.original?.program_type_id !== "number" &&
            row?.original?.program_type_id?.name}
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center text-primary">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Copy course</DropdownMenuItem>
              <DropdownMenuItem>Edit Course</DropdownMenuItem>
              <DropdownMenuItem>View Course</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

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

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: "program_code",
    enableHiding: false,
    header: () => {
      return <div>Course ID</div>;
    },

    cell: ({ row }) => {
      return (
        <div>
          <div>{row.original.program_code}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "program_types",
    header: () => {
      return <div>Course Type Name</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.program_types?.name}</div>;
    },
  },
  {
    accessorKey: "program_type_alias_names",
    header: () => {
      return <div>Course Name</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.program_type_alias_names?.alias_name}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <div>Course Status</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.status_id}</div>;
    },
  },
  {
    accessorKey: "state",
    header: () => {
      return <div>State</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.state?.name}</div>;
    },
  },
  {
    accessorKey: "city",
    header: () => {
      return <div>City</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.city?.name}</div>;
    },
  },
  {
    accessorKey: "center",
    header: () => {
      return <div>Center</div>;
    },

    cell: ({ row }) => {
      return <div>{row?.original?.center?.name}</div>;
    },
  },
  {
    accessorKey: "program_teachers",
    header: () => {
      return <div>Teachers</div>;
    },
    cell: ({ row }) => {
      const teachers = row?.original?.program_teachers?.map(
        (teacher: ProgramTeachers) => teacher?.users?.user_name
      );
      return (
        <div>
          <div>{teachers && teachers.join(", ")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "program_organizers",
    header: () => {
      return <div>Organizers</div>;
    },
    cell: ({ row }) => {
      const organizers = row?.original?.program_organizers?.map(
        (Organizer: ProgramOrganizers) => Organizer?.users?.user_name
      );
      return <div>{organizers && organizers.join(",")}</div>;
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

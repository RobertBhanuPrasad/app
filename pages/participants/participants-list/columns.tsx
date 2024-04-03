import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from "lucide-react";
import { Button } from "src/ui/button";
// import { Checkbox } from "src/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";

interface ParticipantRegistration {
  id: number;
  created_at: string;
  contact_id: number;
  discount_code_id: number | null;
  is_payment_refund_request: boolean | null;
  is_payment_refunded: boolean | null;
  participant_attendence_status_id: number | null;
  price_category_id: number | null;
  program_category_id: number | null;
  program_id: number;
  discount_code: string | null;
  discounted_amount: number | null;
  discounted_tax: number | null;
  hear_program_from_id: number | null;
  is_health_declaration_checked: boolean | null;
  is_program_agreement_checked: boolean | null;
  legal_agreement_version: number | null;
  payment_status_id: number;
}

interface CustomColumnDef<T> {
  pinPosition?: string;
}

// Use an intersection type to combine with ColumnDef
type ExtendedColumnDef<T> = CustomColumnDef<T> & ColumnDef<T>;

export const columns: ExtendedColumnDef<ParticipantRegistration>[] = [
  {
    accessorKey: "Registration ID",
    enablePinning: true,
    header: ({ column }) => {
      return <div className="min-w-[150px] text-center">Registration ID</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="min-w-[150px] text-center">{row?.original?.id}</div>
      );
    },
  },
  {
    accessorKey: "Registration Date",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Registration Date
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
      return (
        <div className="lowercase min-w-[50px] text-center">
          {row?.original?.created_at}
        </div>
      );
    },
  },
  {
    accessorKey: "Name",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
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
      return (
        <div className="lowercase min-w-[100px] text-center">
          {row?.original?.contact_id?.full_name}
        </div>
      );
    },
  },
  {
    accessorKey: "Date of Birth",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date of Birth
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
      return (
        <div className="lowercase min-w-[100px] text-center">
          {row?.original?.contact_id?.date_of_birth}
        </div>
      );
    },
  },
  {
    accessorKey: "Phone",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
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
      return (
        <div className="lowercase min-w-[100px] text-center">
          {row?.original?.contact_id?.mobile}
        </div>
      );
    },
  },
  {
    accessorKey: "Email",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
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
      return (
        <div className="lowercase min-w-[100px] text-center">
          {row?.original?.contact_id?.email}
        </div>
      );
    },
  },
  {
    accessorKey: "Fee Level",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fee Level
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
      return (
        <div className="lowercase min-w-[150px] text-center">
          {row?.original?.price_category_id?.fee_level_id?.value}
        </div>
      );
    },
  },
  {
    accessorKey: "Program Agreement Version",
    enablePinning: true,
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-center">
          Program Agreement Version
        </div>
      );
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="min-w-[150px] text-center">
          {row?.original?.legal_agreement_version}
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      const optionsValues = [
        "View Participant",
        "Edit Participant",
        "Transfer",
        "Send Email",
        "Perform sale with cash, check offline credit card payment",
        "Send registration confirmation email",
        "Upload offline payment receipt",
        "Download receipt",
        "Transaction Activity",
      ];
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {optionsValues.map((value) => (
              <DropdownMenuItem>{value}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

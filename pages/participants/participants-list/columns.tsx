import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, MoreVertical } from "lucide-react";
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
    enableHiding: false,
    header: ({ column }) => {
      return <div className="min-w-[150px] text-left">Registration ID</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <a className="cursor-pointer">
          <div className="min-w-[150px] text-left font-bold text-[#7677F4]">
            {row?.original?.id}
          </div>
        </a>
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
        <div className="text-left">{row?.original?.registration_date}</div>
      );
    },
  },
  {
    accessorKey: "NIF",
    header: ({ column }) => {
      return <div className="text-left">NIF</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return <div className="text-left">{row?.original?.contact_id?.nif}</div>;
    },
  },
  {
    accessorKey: "Name",
    enableHiding: false,
    enableSorting: true,
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
        <div className="text-left">{row?.original?.contact_id?.full_name}</div>
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
        <div className="text-left">
          {row?.original?.contact_id?.date_of_birth}
        </div>
      );
    },
  },
  {
    accessorKey: "Phone",
    enableHiding: false,
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
        <div className="text-left">{row?.original?.contact_id?.mobile}</div>
      );
    },
  },
  {
    accessorKey: "Email",
    enableHiding: false,
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
        <div className="lowercase text-left">
          {row?.original?.contact_id?.email}
        </div>
      );
    },
  },
  {
    accessorKey: "Fee Level",
    enableHiding: false,
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
        <div className="titlecase text-left">
          {row?.original?.price_category_id?.fee_level_id?.value}
        </div>
      );
    },
  },
  {
    accessorKey: "Amount",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
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
        <div className="text-left">
          {row?.original?.price_category_id?.amount}
        </div>
      );
    },
  },
  {
    accessorKey: "Transaction Type",
    header: ({ column }) => {
      return <div className="min-w-[150px] text-left">Transaction Type</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.payment_status?.transaction_type}
        </div>
      );
    },
  },
  {
    accessorKey: "Transaction ID",
    header: ({ column }) => {
      return <div className="text-left">Transaction ID</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.payment_status?.transaction_id}
        </div>
      );
    },
  },
  {
    accessorKey: "Payment Method",
    header: ({ column }) => {
      return <div className="min-w-[200px] text-left">Payment Method</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.payment_status?.payment_method}
        </div>
      );
    },
  },
  {
    accessorKey: "Balance",
    header: ({ column }) => {
      return <div className="text-left">Balance</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.payment_status?.balance}
        </div>
      );
    },
  },
  {
    accessorKey: "Transaction Status",
    enableHiding: false,
    header: ({ column }) => {
      return <div className="min-w-[150px] text-left">Transaction Status</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.payment_status?.transaction_status}
        </div>
      );
    },
  },
  {
    accessorKey: "Attendance Status",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Attendance Status
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
        <div className="text-left">
          {row?.original?.participant_attendence_status_id?.value}
        </div>
      );
    },
  },
  {
    accessorKey: "Program Agreement Version",
    header: ({ column }) => {
      return <div className="text-left">Program Agreement Version</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="min-w-[150px] text-left">
          {row?.original?.legal_agreement_version}
        </div>
      );
    },
  },
  {
    accessorKey: "Program Agreement Status",
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">Program Agreement Status</div>
      );
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="min-w-[150px] text-left">
          {row?.original?.program_agreement_status}
        </div>
      );
    },
  },
  {
    accessorKey: "Program Agreement Date",
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">Program Agreement Date</div>
      );
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="min-w-[150px] text-left">
          {row?.original?.program_agreement_date}
        </div>
      );
    },
  },
  {
    accessorKey: "Health Declaration Status",
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">Health Declaration Status</div>
      );
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="min-w-[150px] text-left">
          {row?.original?.health_declaration_status}
        </div>
      );
    },
  },
  {
    accessorKey: "Health Declaration Consent Date",
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">
          Health Declaration Consent Date
        </div>
      );
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="min-w-[150px] text-left">
          {row?.original?.health_declaration_date}
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
            <Button variant="ghost" className="h-8 w-8 p-0 text-[#7677F4]">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-4 p-3 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
              {optionsValues.map((value) => (
                <DropdownMenuItem>{value}</DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

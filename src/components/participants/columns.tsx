import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "src/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "src/ui/dropdown-menu";

// Use an intersection type to combine with ColumnDef
type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

export const columns: ExtendedColumnDef<any>[] = [
    {
        accessorKey: "participant_code",
        column_name: "Registration ID",
        enablePinning: true,
        enableHiding: false,
        header: ({ column }) => {
            return (
                <div className="min-w-[150px] text-left">Registration ID</div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                // TODO: Write onClick to redirect to view participant page
                <a className="cursor-pointer">
                    <div className="min-w-[150px] text-left font-bold text-[#7677F4]">
                        {row?.original?.participant_code}
                    </div>
                </a>
            );
        },
    },
    {
        accessorKey: "created_at",
        column_name: "Registration Date",
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Registration Date
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            const db_date = formatDate(row?.original?.created_at);
            return <div className="text-left pl-4">{db_date}</div>;
        },
    },
    {
        accessorKey: "Name",
        column_name: "Name",
        enableHiding: false,
        enableSorting: true,
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            return (
                <div className="text-left pl-4 !min-w-[175px] capitalize">
                    {row?.original?.contact_id?.full_name}
                </div>
            );
        },
    },
    {
        accessorKey: "NIF",
        column_name: "NIF",
        header: ({ column }) => {
            return <div className="text-left">NIF</div>;
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                <div className="text-left !min-w-[125px]">
                    {row?.original?.contact_id?.nif}
                </div>
            );
        },
    },
    {
        accessorKey: "Date of Birth",
        column_name: "Date of Birth",
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Date of Birth
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            const db_date = formatDate(
                row?.original?.contact_id?.date_of_birth
            );
            return (
                <div className="text-left !min-w-[150px] pl-4">
                    {db_date.length ? db_date : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Phone",
        column_name: "Phone",
        enableHiding: false,
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Phone
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            return (
                <div className="text-left !min-w-[150px] pl-4">
                    {row?.original?.contact_id?.mobile}
                </div>
            );
        },
    },
    {
        accessorKey: "Email",
        column_name: "Email",
        enableHiding: false,
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Email
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            return (
                <div className="lowercase text-left !min-w-[150px] pl-4">
                    {row?.original?.contact_id?.email}
                </div>
            );
        },
    },
    {
        accessorKey: "Fee Level",
        column_name: "Fee Level",
        enableHiding: false,
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Fee Level
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            return (
                <div className=" capitalize text-left !min-w-[150px] pl-4">
                    {row?.original?.price_category_id?.fee_level_id?.value}
                </div>
            );
        },
    },
    {
        accessorKey: "Amount",
        column_name: "Amount",
        enableHiding: false,
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Amount
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            return (
                <div className="text-left !min-w-[150px] pl-4">
                    {row?.original?.price_category_id?.total}
                </div>
            );
        },
    },
    {
        accessorKey: "Transaction Type",
        column_name: "Transaction Type",
        header: ({ column }) => {
            return (
                <div className="min-w-[150px] text-left">Transaction Type</div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                <div className="text-left">
                    {row?.original?.participant_payment_history[0]
                        ?.transaction_type_id?.value
                        ? row?.original?.participant_payment_history[0]
                              ?.transaction_type_id?.value
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Transaction ID",
        column_name: "Transaction ID",
        header: ({ column }) => {
            return (
                <div className=" min-w-[200px] text-left">Transaction ID</div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                <div className="text-left">
                    {row?.original?.participant_payment_history[0]
                        ?.payment_transaction_id
                        ? row?.original?.participant_payment_history[0]
                              ?.payment_transaction_id
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Payment Method",
        column_name: "Payment Method",
        header: ({ column }) => {
            return (
                <div className="min-w-[200px] text-left">Payment Method</div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                <div className="text-left">
                    {row?.original?.participant_payment_history[0]
                        ?.payment_method
                        ? row?.original?.participant_payment_history[0]
                              ?.payment_method
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Balance",
        column_name: "Balance",
        header: ({ column }) => {
            return <div className="text-left">Balance</div>;
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                <div className="text-left">
                    {row?.original?.payment_status?.balance
                        ? row?.original?.payment_status?.balance
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Transaction Status",
        column_name: "Transaction Status",
        enableHiding: false,
        header: ({ column }) => {
            return (
                <div className="min-w-[150px] text-left">
                    Transaction Status
                </div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                <div className="text-left">
                    {row?.original?.payment_status_id?.value
                        ? row?.original?.payment_status_id?.value
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Attendance Status",
        column_name: "Attendance Status",
        enableHiding: false,
        header: ({ column }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Attendance Status
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <CaretSortIcon
                                className="ml-2 size-4"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </div>
            );
        },

        cell: ({ row }: any) => {
            return (
                <div className="text-left !min-w-[150px] pl-4">
                    {row?.original?.participant_attendence_status_id?.value
                        ? row?.original?.participant_attendence_status_id?.value
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Program Agreement Version",
        column_name: "Program Agreement Version",
        header: ({ column }) => {
            return <div className="text-left">Program Agreement Version</div>;
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            return (
                <div className="min-w-[150px] text-left">
                    {row?.original?.legal_agreement_version
                        ? row?.original?.legal_agreement_version
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Program Agreement Status",
        column_name: "Program Agreement Status",
        header: ({ column }) => {
            return (
                <div className="min-w-[150px] text-left">
                    Program Agreement Status
                </div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            const toggle = row?.original?.is_program_agreement_checked
                ? "Completed"
                : "Pending";
            return <div className="min-w-[150px] text-left">{toggle}</div>;
        },
    },
    {
        accessorKey: "Program Agreement Date",
        column_name: "Program Agreement Date",
        header: ({ column }) => {
            return (
                <div className="min-w-[150px] text-left">
                    Program Agreement Date
                </div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            const db_date = formatDate(row?.original?.program_agreement_date);
            return (
                <div className="min-w-[150px] text-left">
                    {row?.original?.program_agreement_date ? db_date : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "Health Declaration Status",
        column_name: "Health Declaration Status",
        header: ({ column }) => {
            return (
                <div className="min-w-[150px] text-left">
                    Health Declaration Status
                </div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            const toggle = row?.original?.is_health_declaration_checked
                ? "Completed"
                : "Pending";
            return <div className="min-w-[150px] text-left">{toggle}</div>;
        },
    },
    {
        accessorKey: "Health Declaration Consent Date",
        column_name: "Health Declaration Consent Date",
        header: ({ column }) => {
            return (
                <div className="min-w-[150px] text-left">
                    Health Declaration Consent Date
                </div>
            );
        },

        // This any will be removed after internal dataStructure implementation

        cell: ({ row }: any) => {
            const db_date = formatDate(
                row?.original?.health_declaration_consent_date
            );
            return (
                <div className="min-w-[150px] text-left">
                    {row?.original?.health_declaration_consent_date
                        ? db_date
                        : "-"}
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
            // console.log("ROW", row);
            const router = useRouter();
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-[#7677F4]"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <div className="flex flex-col gap-4 p-3 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
                            {optionsValues.map((value, index) => (
                                <DropdownMenuItem
                                    onClick={() => {
                                        handleActions(
                                            index,
                                            row?.original?.id,
                                            router
                                        );
                                    }}
                                >
                                    {value}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
}

export const handleActions = (
    index: number,
    participant_id: any,
    router: any
) => {
    switch (index) {
        case 0: {
            // TODO: Navigate to view participant page
            const routePath=router.asPath.split('?')[0]
            router.push(`/${routePath}/${participant_id}/view`);
            break;
        }
        case 1: {
            // TODO: Navigate to edit participant page
            const routePath=router.asPath.split('?')[0]
            router.push(`/${routePath}/${participant_id}/edit`);
            break;
        }
        case 2: {
            // TODO(Not in MVP scope): Transfer
            break;
        }
        case 3: {
            // TODO: Send Email, dependency on harmony API
            break;
        }
        case 4: {
            // TODO(Not in MVP scope): Perform Sale
            break;
        }
        case 5: {
            // TODO: Send Registration confirmation email, dependency on Harmony API
            break;
        }
        case 6: {
            // TODO(Not in MVP scope): Upload offline payment receipt
            break;
        }
        case 7: {
            // TODO: Download Receipt, Tejaswini working on it
            break;
        }
        case 8: {
            // TODO: Navigate to view participant page -> Transaction activity tab
            break;
        }
    }
};

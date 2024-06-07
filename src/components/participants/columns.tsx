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
import TransactionActivity from "./TransactionActivityPopover";
import { useTranslation } from 'next-i18next';
import { translatedText } from "src/common/translations";

// Use an intersection type to combine with ColumnDef
type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

export const columns = () =>
{
  const {t} = useTranslation(['common','course.participants','new_strings', 'course.view_course'])
  const columns: ExtendedColumnDef<any>[] = [
  {
    accessorKey: "participant_code",
    column_name: t('course.participants:find_participant.registration_id'),
    enablePinning: true,
    enableHiding: false,
    header: ({ column }) => {
      return <div className="min-w-[150px] text-left">
      {t('course.participants:find_participant.registration_id')}</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      const router = useRouter();
      return (
        <a
          className="cursor-pointer"
          onClick={() => {
            const routePath = router.asPath.split("list")[0];
            router.push(`/${routePath}/${row?.original?.id}`);
          }}
        >
          <div className="min-w-[150px] text-left font-bold text-[#7677F4]">
            {row?.original?.participant_code}
          </div>
        </a>
      );
    },
  },
  {
    accessorKey: "created_at",
    column_name: t('course.participants:find_participant.registration_date'), 
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(undefined,column.getIsSorted() === "asc")
            }}
          >
            {t('course.participants:find_participant.registration_date')}
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
      const db_date = formatDate(row?.original?.created_at);
      return <div className="text-left pl-4">{db_date}</div>;
    },
  },
  {
    accessorKey: "Name",
    column_name: t('course.participants:find_participant.name'),
    enableHiding: false,
    enableSorting: true,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(undefined,column.getIsSorted() === "asc")}
          >
            {t('course.participants:find_participant.name')}
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
        <div className="text-left pl-4 !min-w-[175px]">
          {row?.original?.contact_id?.full_name}
        </div>
      );
    },
  },
  {
    accessorKey: "NIF",
    column_name: t('course.participants:find_participant.nif'),
    header: ({ column }) => {
      return <div className="text-left"> {t('course.participants:find_participant.nif')}</div>;
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
    column_name: t('course.participants:find_participant.date_of_birth'),
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(undefined,column.getIsSorted() === "asc")}
          >
            {t('course.participants:find_participant.date_of_birth')}
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
      const db_date = formatDate(row?.original?.contact_id?.date_of_birth);
      return (
        <div className="text-left !min-w-[150px] pl-4">
          {db_date.length ? db_date : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "Phone",
    column_name: t('course.participants:find_participant.phone'),
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(undefined,column.getIsSorted() === "asc")}
          >
            {t('course.participants:find_participant.phone')}
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
        <div className="text-left !min-w-[150px] pl-4">
          {row?.original?.contact_id?.mobile}
        </div>
      );
    },
  },
  {
    accessorKey: "Email",
    column_name: t('course.participants:find_participant.email'),
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(undefined,column.getIsSorted() === "asc")}
          >
             {t('course.participants:find_participant.email')}
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
        <div className="lowercase text-left !min-w-[150px] pl-4">
          {row?.original?.contact_id?.email}
        </div>
      );
    },
  },
  {
    accessorKey: "Fee Level",
    column_name: t('course.participants:view_participant.fee_level'),
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(undefined,column.getIsSorted() === "asc")}
          >
           {t('course.participants:view_participant.fee_level')}
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
        <div className=" capitalize text-left !min-w-[150px] pl-4">
          {translatedText(row?.original?.price_category_id?.fee_level_id?.name)}
        </div>
      );
    },
  },
  {
    accessorKey: "Amount",
    column_name: t('course.participants:edit_participant.participants_information_tab.amount'),
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(undefined,column.getIsSorted() === "asc")}
          >
             {t('course.participants:edit_participant.participants_information_tab.amount')}
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
        <div className="text-left !min-w-[150px] pl-4">
          {row?.original?.total_amount?.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "Transaction Type",
    column_name: t('course.participants:view_participant.transaction_type'),
    header: ({ column }) => {
      return <div className="min-w-[150px] text-left">{t('course.participants:view_participant.transaction_type')}</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.participant_payment_history?.length > 0 ? (
            <TransactionActivity
              transactionHistory={row?.original?.participant_payment_history}
            />
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "Transaction ID",
    column_name: t('course.participants:view_participant.transaction_id'),
    header: ({ column }) => {
      return <div className=" min-w-[200px] text-left">{t('course.participants:view_participant.transaction_id')}</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      const sortedRows = row?.original?.participant_payment_history.sort(
        (a: any, b: any) => b?.id - a?.id
      );
      return (
        <div className="text-left">
          {row?.original?.participant_payment_history?.length
            ? sortedRows[0]?.payment_transaction_id
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "Payment Method",
    column_name: t('course.participants:view_participant.payment_method'),
    header: ({ column }) => {
      return <div className="min-w-[200px] text-left">{t('course.participants:view_participant.payment_method')}</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.payment_method?.name
            ? translatedText(row?.original?.payment_method?.name)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "Balance",
    column_name: t('new_strings:balance_due'),
    header: ({ column }) => {
      return <div className="text-left">{t('new_strings:balance_due')}</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.balance_due
            ? row?.original?.balance_due?.toFixed(2)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "Transaction Status",
    column_name: t('course.participants:find_participant.transaction_status'),
    enableHiding: false,
    header: ({ column }) => {
      return <div className="min-w-[150px] text-left">{t('course.participants:find_participant.transaction_status')}</div>;
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return (
        <div className="text-left">
          {row?.original?.payment_status_id?.name
            ? translatedText(row?.original?.payment_status_id?.name)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "Attendance Status",
    column_name: t('course.participants:find_participant.attendance_status'),
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(undefined,column.getIsSorted() === "asc")}
          >
            {t('course.participants:find_participant.attendance_status')}
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
        <div className="text-left !min-w-[150px] pl-4">
          {row?.original?.participant_attendence_status_id?.name
            ? translatedText(row?.original?.participant_attendence_status_id?.name)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "Program Agreement Version",
    column_name: t('course.participants:find_participant.program_agreement_version'),
    header: ({ column }) => {
      return <div className="text-left">{t('course.participants:find_participant.program_agreement_version')}</div>;
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
    column_name: t('course.participants:find_participant.program_agreement_status'),
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">{t('course.participants:find_participant.program_agreement_status')}</div>
      );
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      const toggle =
        row?.original?.is_program_agreement_checked === true
          ? "Completed"
          : row?.original?.is_program_agreement_checked === false
          ? "Pending"
          : "-";
      return <div className="min-w-[150px] text-left">{toggle}</div>;
    },
  },
  {
    accessorKey: "Program Agreement Date",
    column_name: t('course.participants:find_participant.program_agreement_date'),
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">{t('course.participants:find_participant.program_agreement_date')}</div>
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
    column_name: t('course.participants:find_participant.health_declaration_status'),
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">{t('course.participants:find_participant.health_declaration_status')}</div>
      );
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      const toggle =
        row?.original?.is_health_declaration_checked === true
          ? "Completed"
          : row?.original?.is_health_declaration_checked === false
          ? "Pending"
          : "-";
      return <div className="min-w-[150px] text-left">{toggle}</div>;
    },
  },
  {
    accessorKey: "Health Declaration Consent Date",
    column_name: t('course.participants:find_participant.health_declaration_consent_date'),
    header: ({ column }) => {
      return (
        <div className="min-w-[150px] text-left">
          {t('course.participants:find_participant.health_declaration_consent_date')}
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
          {row?.original?.health_declaration_consent_date ? db_date : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const optionsValues = [
        t("course.view_course:participants_tab.view_participant"),
        t("new_strings:edit_participant"),
        // TODO(Not in MVP scope): Integrate these actions later
        // "Transfer",
        // "Send Email",
        // "Perform sale with cash, check offline credit card payment",
        // "Send registration confirmation email",
        // "Upload offline payment receipt",
        // "Download receipt",
        // "Transaction Activity",
      ];

      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-[#7677F4]">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col gap-2 max-h-[300px] max-w-[200px] overflow-y-auto scrollbar text-[#333333]">
              {optionsValues.map((value, index) => (
                <DropdownMenuItem
                  onClick={() => {
                    handleActions(index, row?.original?.id, router);
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

return columns

}

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
      const routePath = router.asPath.split("list")[0];
      router.push(`/${routePath}/${participant_id}`);
      break;
    }
    case 1: {
      // TODO: Navigate to edit participant page
      const routePath = router.asPath.split("list")[0];
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

import Form from "@components/Formfield";
import {
  CaretSortIcon,
  CountdownTimerIcon,
  LapTimerIcon,
} from "@radix-ui/react-icons";
import { useGetIdentity, useList } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlarmClock,
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarClockIcon,
  Clock10Icon,
  ClockIcon,
  LucideClock,
  LucideFileClock,
  LucideTimer,
  MoreVertical,
  TimerIcon,
  TimerOff,
  TimerReset,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { translatedText } from "src/common/translations";
import { Button } from "src/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import TransactionActivity from "./TransactionActivityPopover";
import { handleEditPaymentValues } from "./editParticipant/EditParticipantUtil";
import EditPayment from "./editParticipant/editPayment";
import { getActionMenuItems } from "./ParticipantUtils";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { PARTICIPANT_PENDING_PAYMENT_STATUS } from "src/constants/OptionValueOrder";
import { PARTICIPANT_PAYMENT_STATUS } from "src/constants/OptionLabels";

// Use an intersection type to combine with ColumnDef
type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

export const columns = () => {
  const { t } = useTranslation([
    "common",
    "course.participants",
    "new_strings",
    "course.view_course",
    "course.find_course",
  ]);
  const columns: ExtendedColumnDef<any>[] = [
    {
      accessorKey: "participant_code",
      column_name: t("course.participants:find_participant.registration_id"),
      enablePinning: true,
      enableHiding: false,
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-left">
            {t("course.participants:find_participant.registration_id")}
          </div>
        );
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
      accessorKey: "Name",
      column_name: t("course.participants:find_participant.name"),
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
              {t("course.participants:find_participant.name")}
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
          <div className="text-left pl-4 !min-w-[175px] capitalize">
            {row?.original?.contact_id?.full_name}
          </div>
        );
      },
    },
    {
      accessorKey: "Phone",
      column_name: t("course.participants:find_participant.phone"),
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
              {t("course.participants:find_participant.phone")}
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
      column_name: t("course.participants:find_participant.email"),
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
              {t("course.participants:find_participant.email")}
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
      column_name: t("course.participants:view_participant.fee_level"),
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
              {t("course.participants:view_participant.fee_level")}
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
            {translatedText(
              row?.original?.price_category_id?.fee_level_id?.name
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "Amount",
      column_name: t(
        "course.participants:edit_participant.participants_information_tab.amount"
      ),
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
              {t(
                "course.participants:edit_participant.participants_information_tab.amount"
              )}
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
      accessorKey: "Transaction Status",
      column_name: t("course.participants:find_participant.transaction_status"),
      enableHiding: false,
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-left">
            {t("course.participants:find_participant.transaction_status")}
          </div>
        );
      },

      // This any will be removed after internal dataStructure implementation

      cell: ({ row }: any) => {
        const pendingStatusId = getOptionValueObjectByOptionOrder(
          PARTICIPANT_PAYMENT_STATUS,
          PARTICIPANT_PENDING_PAYMENT_STATUS
        )?.id;
        const [editPayment, setEditPayment] = useState(false);

        const [defaultValues, setDefaultValues] = useState({});
        const payment = useList({
          resource: "participant_payment_history",
          meta: {
            select: "id",
          },
          filters: [
            {
              field: "participant_id",
              operator: "eq",
              value: row?.original?.id,
            },
            {
              field: "program_id",
              operator: "eq",
              value: row?.original?.program_id,
            },
          ],
          sorters: [
            {
              field: "created_at",
              order: "desc",
            },
          ],
        });
        const paymentHistoryId = payment?.data?.data[0];
        useEffect(() => {
          async function fetchData() {
            try {
              const values = await handleEditPaymentValues(
                Number(paymentHistoryId?.id)
              );
              setDefaultValues(values);
            } catch (error) {
              console.error("An error occurred:", error);
            }
          }

          if (paymentHistoryId) {
            fetchData();
          }
        }, [paymentHistoryId]);
        return (
          <div>
            <div className="p-[5px] cursor-pointer rounded-sm">
              <Dialog open={editPayment}>
                <DialogTrigger asChild={editPayment}>
                  <div
                    className={
                      row?.original?.payment_status_id?.id == pendingStatusId
                        ? `text-left flex items-center gap-3 text-red-500 font-bold`
                        : `text-left flex items-center gap-3`
                    }
                    onClick={() =>
                      row?.original?.payment_status_id?.id == pendingStatusId &&
                      setEditPayment(!editPayment)
                    }
                  >
                    {row?.original?.payment_status_id?.value
                      ? translatedText(row?.original?.payment_status_id?.name)
                      : "-"}
                    {row?.original?.payment_status_id?.value == "Pending" && (
                      <CountdownTimerIcon />
                    )}
                  </div>
                </DialogTrigger>
                {Object.keys(defaultValues).length > 0 && (
                  <Form onSubmit={() => {}} defaultValues={defaultValues}>
                    {/* Edit payment component accepts payment history id as paymentID and setEditPayment function to handle open or close state */}
                    <EditPayment
                      paymentId={Number(paymentHistoryId)}
                      setEditPayment={setEditPayment}
                    />
                  </Form>
                )}
              </Dialog>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "Attendance Status",
      column_name: t("course.participants:find_participant.attendance_status"),
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
              {t("course.participants:find_participant.attendance_status")}
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
              ? translatedText(
                  row?.original?.participant_attendence_status_id?.name
                )
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "NIF",
      column_name: t("course.participants:find_participant.nif"),
      header: ({ column }) => {
        return (
          <div className="text-left">
            {" "}
            {t("course.participants:find_participant.nif")}
          </div>
        );
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
      column_name: t("course.participants:find_participant.date_of_birth"),
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("course.participants:find_participant.date_of_birth")}
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
      accessorKey: "created_at",
      column_name: t("course.participants:find_participant.registration_date"),
      header: ({ column }) => {
        return (
          <div>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("course.participants:find_participant.registration_date")}
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
      accessorKey: "Transaction Type",
      column_name: t("course.participants:view_participant.transaction_type"),
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-left">
            {t("course.participants:view_participant.transaction_type")}
          </div>
        );
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
      column_name: t("course.participants:view_participant.transaction_id"),
      header: ({ column }) => {
        return (
          <div className=" min-w-[200px] text-left">
            {t("course.participants:view_participant.transaction_id")}
          </div>
        );
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
      column_name: t("course.participants:view_participant.payment_method"),
      header: ({ column }) => {
        return (
          <div className="min-w-[200px] text-left">
            {t("course.participants:view_participant.payment_method")}
          </div>
        );
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
      column_name: t("new_strings:balance_due"),
      header: ({ column }) => {
        return <div className="text-left">{t("new_strings:balance_due")}</div>;
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
      accessorKey: "Program Agreement Version",
      column_name: t(
        "course.participants:find_participant.program_agreement_version"
      ),
      header: ({ column }) => {
        return (
          <div className="text-left">
            {t(
              "course.participants:find_participant.program_agreement_version"
            )}
          </div>
        );
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
      column_name: t(
        "course.participants:find_participant.program_agreement_status"
      ),
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-left">
            {t("course.participants:find_participant.program_agreement_status")}
          </div>
        );
      },

      // This any will be removed after internal dataStructure implementation

      // cell: ({ row }: any) => {
      //   const toggle =
      //     row?.original?.is_program_agreement_checked === true
      //       ? "Completed"
      //       : row?.original?.is_program_agreement_checked === false
      //       ? "Pending"
      //       : "-";
      //   return <div className="min-w-[150px] text-left">{toggle}</div>;
      // },
      cell: ({ row }: any) => {
        const toggle =
          row?.original?.is_program_agreement_checked === true
            ? t("course.find_course:completed")
            : row?.original?.is_program_agreement_checked === false
            ? t("course.participants:edit_participant.pending")
            : "-";
        return <div className="min-w-[150px] text-left">{toggle}</div>;
      },
    },
    {
      accessorKey: "Program Agreement Date",
      column_name: t(
        "course.participants:find_participant.program_agreement_date"
      ),
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-left">
            {t("course.participants:find_participant.program_agreement_date")}
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
      column_name: t(
        "course.participants:find_participant.health_declaration_status"
      ),
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-left">
            {t(
              "course.participants:find_participant.health_declaration_status"
            )}
          </div>
        );
      },

      // This any will be removed after internal dataStructure implementation

      // cell: ({ row }: any) => {
      //   const toggle =
      //     row?.original?.is_health_declaration_checked === true
      //       ? "Completed"
      //       : row?.original?.is_health_declaration_checked === false
      //       ? "Pending"
      //       : "-";
      //   return <div className="min-w-[150px] text-left">{toggle}</div>;
      // },
      cell: ({ row }: any) => {
        const toggle =
          row?.original?.is_health_declaration_checked === true
            ? t("course.find_course:completed")
            : row?.original?.is_health_declaration_checked === false
            ? t("course.participants:edit_participant.pending")
            : "-";
        return <div className="min-w-[150px] text-left">{toggle}</div>;
      },
    },
    {
      accessorKey: "Health Declaration Consent Date",
      column_name: t(
        "course.participants:find_participant.health_declaration_consent_date"
      ),
      header: ({ column }) => {
        return (
          <div className="min-w-[150px] text-left">
            {t(
              "course.participants:find_participant.health_declaration_consent_date"
            )}
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
        const router = useRouter();
        const { data: loggedInUserData }: any = useGetIdentity();
        const actionMenu = getActionMenuItems(
          loggedInUserData?.userData.user_roles
        );

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-[#7677F4]">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex flex-col gap-2 max-h-[300px] max-w-[170px] overflow-y-auto scrollbar text-[#333333]">
                {actionMenu?.map((value: any, index) => (
                  <DropdownMenuItem
                    onClick={() => {
                      handleActions(value?.order, row?.original?.id, router, row?.original?.contact_id?.email);
                    }}
                  >
                    {value?.option}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

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
  router: any,
  participant_email: string
) => {
  switch (index) {
    case 1: {
      // TODO: Navigate to view participant page
      const routePath = router.asPath.split("list")[0];
      router.push(`/${routePath}/${participant_id}`);
      break;
    }
    case 2: {
      // TODO: Navigate to edit participant page
      const routePath = router.asPath.split("list")[0];
      router.push(`/${routePath}/${participant_id}/edit`);
      break;
    }
    case 3: {
      // TODO(Not in MVP scope): Transfer
      break;
    }
    case 4: {
        const mailtoUrl = `mailto:${participant_email}`;
        window.open(mailtoUrl)
      // TODO: Send Email, dependency on harmony API
      break;
    }
    case 5: {
      // TODO(Not in MVP scope): Perform Sale
      break;
    }
    case 6: {
      // TODO: Send Registration confirmation email, dependency on Harmony API
      break;
    }
    case 7: {
      // TODO(Not in MVP scope): Upload offline payment receipt
      break;
    }
    case 8: {
      // TODO: Download Receipt, Tejaswini working on it
      break;
    }
    case 9: {
      // TODO: Navigate to view participant page -> Transaction activity tab
      break;
    }
  }
};

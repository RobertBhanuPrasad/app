import { useList, useTable, useUpdateMany } from "@refinedev/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import {
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
} from "src/constants/OptionLabels";
import { Button } from "src/ui/button";
import {
  getOptionValueObjectByOptionOrder,
  getOptionValuesByOptionLabel,
} from "src/utility/GetOptionValuesByOptionLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import {
  PARTICIPANT_FAILED_PAYMENT_STATUS,
  PARTICIPANT_PENDING_PAYMENT_STATUS,
  PENDING_ATTENDANCE_STATUS,
  UPDATE_ATTENDENCE_STATUS,
} from "src/constants/OptionValueOrder";
import { useController, useFormContext } from "react-hook-form";
import { ActionProps, getActions } from "@components/courseBusinessLogic";
import { BaseTable } from "@components/course/findCourse/BaseTable";
import { TableHeader, Text } from "src/ui/TextTags";
import { supabaseClient } from "src/utility";
import { Dialog, DialogContent } from "src/ui/dialog";
import Tick from "@public/assets/Tick.png";

function CloseParticipantsSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { setValue } = useFormContext();

  /**
   * When user click on next button we have to change the close_registration section to revenue section
   * For that we are updating current_section params
   */
  function handleNextClick() {
    const params = new URLSearchParams(searchParams);

    params.set("current_section", "revenue");

    // we have to use this replace method
    replace(`${pathname}?${params.toString()}`);
  }

  //getting pending attendence status id
  const pendingAttendenceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    PENDING_ATTENDANCE_STATUS
  )?.id;

  //getting pending transacion status id
  const pendingTransactionStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_PENDING_PAYMENT_STATUS
  )?.id;

  //Getting participant data
  const { tableQueryResult: participantData } = useTable({
    resource: "participant_registration",
    meta: {
      select: "*,contact(full_name) ,payment_method(id,value)",
    },
    pagination: {
      pageSize: 1000,
    },
    filters: {
      permanent: [
        {
          operator: "or",
          value: [
            {
              field: "is_program_agreement_checked",
              operator: "eq",
              value: false,
            },
            {
              field: "is_health_declaration_checked",
              operator: "eq",
              value: false,
            },
            {
              field: "payment_status_id",
              operator: "eq",
              value: pendingTransactionStatusId,
            },
            {
              field: "participant_attendence_status_id",
              operator: "eq",
              value: pendingAttendenceStatusId,
            },
          ],
        },
        {
          field: "program_id",
          operator: "eq",
          value: 11, //TODO will remove after wards
        },
      ],
    },
    sorters: {
      permanent: [
        {
          field: "participant_code",
          order: "asc",
        },
      ],
    },
  });

  const {
    field: { value: actionValue, onChange: actionOnChange },
  } = useController({
    name: "actions",
  });

  const {
    field: { value: statusValue, onChange: statusOnChange },
  } = useController({
    name: "status",
  });

  //Getting attendance status data from option values
  const attendanceStatusData = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  //Getting payment status data from option values
  const paymentStatusData = getOptionValuesByOptionLabel(
    PARTICIPANT_PAYMENT_STATUS
  )?.[0]?.option_values;

  //updating the status data based on
  const statusData =
    actionValue == UPDATE_ATTENDENCE_STATUS
      ? attendanceStatusData
      : paymentStatusData;

  const [rowSelection, setRowSelection] = useState({});

  const [open, setOpen] = useState(false);
  const { mutate } = useUpdateMany();

  const handleStatusChange = async (value: OptionValuesDataBaseType) => {
    statusOnChange(value);
    const participantIds = Object.keys(rowSelection).map((key) =>
      parseInt(key)
    );

    if (actionValue == UPDATE_ATTENDENCE_STATUS) {
      await mutate({
        resource: "participant_registration",
        values: {
          participant_attendence_status_id: value,
        },
        ids: participantIds,
        invalidates: ["list"],
      });
    } else {
      await mutate({
        resource: "participant_registration",
        values: {
          payment_status_id: value,
        },
        ids: participantIds,
        invalidates: ["list"],
      });
    }

    setOpen(true);
  };

  return (
    <div>
      <div className="m-6 flex flex-col gap-4">
        <div className="ml-auto flex flex-row gap-4">
          <div>
            <Select
              //Disabled when i havent select any row from the table
              disabled={Object.keys(rowSelection).length === 0}
              value={actionValue}
              onValueChange={actionOnChange}
            >
              <SelectTrigger className="w-[254px]">
                <SelectValue placeholder="Select Action" />
                {Object.keys(rowSelection).length > 0 && actionValue && (
                  <Text className="text-[#7677F4] font-semibold">
                    ({Object.keys(rowSelection).length})
                  </Text>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItems onBottomReached={() => {}}>
                  <SelectItem className="h-[44px]" value={1}>
                    Update Attendance Status
                  </SelectItem>
                  <SelectItem className="h-[44px]" value={2}>
                    Update Transaction Status
                  </SelectItem>
                </SelectItems>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              //disabled when no action is selected
              disabled={actionValue == undefined || actionValue == ""}
              value={statusValue}
              onValueChange={(val: any) => {
                handleStatusChange(val);
              }}
            >
              <SelectTrigger className="w-[254px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItems onBottomReached={() => {}}>
                  {statusData?.map(
                    (status: OptionValuesDataBaseType, index: number) => {
                      return (
                        <SelectItem
                          key={index}
                          value={status.id}
                          className="h-[44px]"
                        >
                          {status.value}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectItems>
              </SelectContent>
            </Select>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="w-[414px] h-[325px]">
                <div className="flex flex-col gap-4 items-center">
                  <div className="flex justify-center">
                    <Image src={Tick} alt="tick" />
                  </div>
                  <div className="font-semibold text-center text-[20px]">
                    {Object.keys(rowSelection).length} Records Successfully
                    Updated{" "}
                  </div>
                  <div className="text-center text-[16px]">
                    The updates have been saved. Attendance status for
                    participants with pending transfer request cannot be
                    changed.
                  </div>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      setValue("actions", "");
                      setValue("status", "");
                      setRowSelection({});
                    }}
                    className="w-[91px] h-[46px] rounded-[12px]"
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <BaseTable
          checkboxSelection={true}
          pagination={false}
          tableStyles={{
            table: "",
            rowStyles: "!important border-none",
          }}
          columns={participantsColumns}
          data={participantData?.data?.data || []}
          columnPinning={false}
          columnSelector={false}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>

      <div className="flex flex-row gap-4 items-center justify-center">
        <Button
          className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
          onClick={() => {
            replace("/Courses/ViewCourse/2");
          }}
        >
          Previous
        </Button>
        <Button
          className="w-[87px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
          onClick={handleNextClick}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default CloseParticipantsSection;

export const participantsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "participant_code",
    enableHiding: false,
    header: () => {
      return (
        <div className="min-w-[150px]">
          <TableHeader className="!text-[16px]">Registration ID</TableHeader>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          onClick={() => {}}
          className="min-w-[150px] text-[#7677F4] font-semibold cursor-pointer"
        >
          <Text className="!text-[#7677F4] font-semibold">
            {row?.original?.participant_code}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    enableHiding: false,
    header: () => {
      return (
        <div className="w-[150px]">
          <TableHeader className="!text-[16px]">Participant Name</TableHeader>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="w-[150px]">
          <Text className="max-w-[130px] truncate">
            <abbr
              title={row?.original?.contact?.full_name}
              className="no-underline"
            >
              {row?.original?.contact?.full_name
                ? row?.original?.contact?.full_name
                : "-"}
            </abbr>
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: "payment-method",
    enableHiding: false,
    header: () => {
      return (
        <div className="min-w-[150px]">
          <TableHeader className="!text-[16px]"> Payment method</TableHeader>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="min-w-[150px]">
          <Text>
            {row?.original?.payment_method?.value
              ? row?.original?.payment_method?.value
              : "-"}
          </Text>
        </div>
      );
    },
  },
  {
    id: "Actions",
    enableHiding: false,
    header: () => {
      return (
        <div className="min-w-[150px]">
          <TableHeader className="!text-[16px]">
            {" "}
            Required Action (s)
          </TableHeader>
        </div>
      );
    },
    cell: ({ row }) => {
      const actions: string[] = getActions({
        //TODO will have few changes after settings data
        attendenceStatusId: row.original.participant_attendence_status_id,
        transactionStatusId: row.original.payment_status_id,
        isPPAConsentChecked: row.original.is_program_agreement_checked,
        isHealthDeclarationChecked: row.original.is_health_declaration_checked,
      });
      return (
        <div className="min-w-[150px]">
          {actions.map((action, index) => (
            <Text key={index}>{action}</Text>
          ))}
        </div>
      );
    },
  },
];

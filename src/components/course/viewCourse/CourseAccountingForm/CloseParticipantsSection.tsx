import { useList, useOne, useTable, useUpdateMany } from "@refinedev/core";
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
  PARTICIPANT_PENDING_PAYMENT_STATUS,
  PENDING_ATTENDANCE_STATUS,
  UPDATE_ATTENDENCE_STATUS,
} from "src/constants/OptionValueOrder";
import { useController, useFormContext } from "react-hook-form";
import { getActions } from "@components/courseBusinessLogic";
import { BaseTable } from "@components/course/findCourse/BaseTable";
import { TableHeader, Text } from "src/ui/TextTags";
import { Dialog, DialogContent } from "src/ui/dialog";
import { useRouter as useNextRouter } from "next/router";
import Tick from "@public/assets/Tick.png";
import { translatedText } from "src/common/translations";

function CloseParticipantsSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { query } = useNextRouter();

  //Getting the program Data using the id from the url
  const { data: programData } = useOne({
    resource: "program",
    id: query?.id as string,
  });

  //TODO settings in progress
  const { data: courseAccountingSettingsData } = useList({
    resource: "course_accounting_config",
    filters: [
      {
        field: "organization_id",
        operator: "eq",
        value: programData?.data?.organization_id,
      },
    ],
  });

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

  /**
   * variable for getting the pending attendence status id
   */
  const pendingAttendenceStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_ATTENDANCE_STATUS,
    PENDING_ATTENDANCE_STATUS
  )?.id;

  /**
   * variable for getting the pending transaction status id
   */
  const pendingTransactionStatusId = getOptionValueObjectByOptionOrder(
    PARTICIPANT_PAYMENT_STATUS,
    PARTICIPANT_PENDING_PAYMENT_STATUS
  )?.id;

  // Retrieving participant data from the 'participant_registration' table
  const { tableQueryResult: participantData } = useTable({
    resource: "participant_registration",
    meta: {
      // Selecting all columns along with the participant's full name and payment method details
      select: "*, contact(full_name), payment_method(id, value)",
    },
    pagination: {
      // Setting pagination to fetch a maximum of 1000 records per page
      pageSize: 1000,
    },
    filters: {
      permanent: [
        // Applying OR condition for filtering participants who meet any of the following criteria:
        {
          operator: "or",
          value: [
            // Participants who haven't checked the program agreement
            {
              field: "is_program_agreement_checked",
              operator: "eq",
              value: false,
            },
            // Participants who haven't completed the health declaration
            {
              field: "is_health_declaration_checked",
              operator: "eq",
              value: false,
            },
            // Participants with pending payment status
            {
              field: "payment_status_id",
              operator: "eq",
              value: pendingTransactionStatusId,
            },
            // Participants with pending attendance status
            {
              field: "participant_attendence_status_id",
              operator: "eq",
              value: pendingAttendenceStatusId,
            },
          ],
        },
        {
          // Filtering participants by the program ID
          field: "program_id",
          operator: "eq",
          value: query?.id as string,
        },
      ],
    },
    sorters: {
      permanent: [
        // Sorting the participant data based on their participant code in ascending order
        { field: "participant_code", order: "asc" },
      ],
    },
  });

  // useController hook  for action dropdown to get value and onChange
  const {
    field: { value: actionValue, onChange: actionOnChange },
  } = useController({
    name: "action_id",
  });

  // useController hook  for status dropdown to get value and onChange
  const {
    field: { value: statusValue, onChange: statusOnChange },
  } = useController({
    name: "status_id",
  });

  /**
   * variable for getting the attendence status data
   */
  const attendanceStatusData = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  /**
   * variable for getting the payment status data
   */
  const paymentStatusData = getOptionValuesByOptionLabel(
    PARTICIPANT_PAYMENT_STATUS
  )?.[0]?.option_values;

  /**
   * variable for getting status data based on action
   */ const statusData =
    actionValue == UPDATE_ATTENDENCE_STATUS
      ? attendanceStatusData
      : paymentStatusData;

  // state variable for row selection
  const [rowSelection, setRowSelection] = useState({});

  // state variable to open and close the dialog after updating the recirds
  const [open, setOpen] = useState(false);

  // The hook for bulk update
  const { mutate } = useUpdateMany();

  /**
   * Function to handle the bulk update of attendance and transaction status
   */
  const handleStatusChange = async (value: OptionValuesDataBaseType) => {
    statusOnChange(value);

    /**
     * variable for retrieving participant ids
     */
    const participantIds = Object.keys(rowSelection).map((key) =>
      parseInt(key)
    );

    // Conditionally update the participant registration based on the action value:
    // If actionValue is UPDATE_ATTENDENCE_STATUS, update the participant_attendence_status_id;
    // Otherwise, update the payment_status_id.
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

    //Opening the dialog that shows that we have successfully updated the records
    setOpen(true);
  };

  return (
    <div>
      <div className="m-6 flex flex-col gap-4">
        <div className="ml-auto flex flex-row gap-4">
          <div>
            {/* select dropdown for displaying actions */}
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
            {/* select dropdown for displaying status */}
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
                          {translatedText(status.name as object)}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectItems>
              </SelectContent>
            </Select>

            {/* Dialog definition when we have updated the records it should open */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="w-[414px] h-[325px] !p-4 !rounded-xl">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <Image src={Tick} alt="tick" />
                  </div>
                  <Text className="font-semibold text-center text-[20px]">
                    {Object.keys(rowSelection).length} Records Successfully
                    Updated{" "}
                  </Text>
                  <Text className="text-center text-[17px]">
                    The updates have been saved. Attendance status <br />
                    for participants with pending transfer request <br />
                    cannot be changed.
                  </Text>
                  <div className="flex flex-row justify-center">
                    <Button
                      onClick={() => {
                        //closing the dialog when we click on close
                        setOpen(false);
                        //clearing all the fields because we have updated the selected rows status
                        setValue("action_id", "");
                        //clearing the selected status field if no rows are selected then it should be disabled and to be in default state
                        setValue("status_id", "");
                        //setting the row selcection empty beause we have updated the status for seleted rows now it should be empty
                        setRowSelection({});
                      }}
                      className="w-[91px] h-[46px] rounded-[12px]"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <BaseTable
            checkboxSelection={true}
            pagination={false}
            tableStyles={{
              table: "",
              rowStyles: "!important border-none",
              tableContainer: "!h-[350px] !rounded-xl",
              tableHeader: "bg-[#F1F1FE] sticky top-0 z-10",
            }}
            columns={participantsColumns}
            data={participantData?.data?.data || []}
            columnPinning={false}
            columnSelector={false}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-center">
        <Button
          className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
          onClick={() => {
            replace(`/courses/${query.id}?tab=course_accounting_form`);
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
            {/* getting the participant_code from the row data */}
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
          {/* truncating the column if the value overflows and adding abbr tag */}
          <Text className="max-w-[130px] truncate">
            <abbr
              title={row?.original?.contact?.full_name}
              className="no-underline"
            >
              {/* getting the full_name from the row data */}
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
          {/* getting the payment_method from the row data */}
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
      //Getting actions based on participant status , transaction status , ppa consent , health declaration consent
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

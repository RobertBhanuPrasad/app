import { BaseTable } from "@components/course/findCourse/BaseTable";
import { useTable } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PARTICIPANT_ATTENDANCE_STATUS,
  PARTICIPANT_PAYMENT_STATUS,
} from "src/constants/OptionLabels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import { getOptionValuesByOptionLabel } from "src/utility/GetOptionValuesByOptionLabel";

function CloseRegistrations() {
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
              value: 34,
            },
            {
              field: "participant_attendence_status_id",
              operator: "eq",
              value: 60,
            },
          ],
        },
      ],
    },
  });

  console.log("heyy participant data", participantData?.data?.data);

  const attendanceStatusData = getOptionValuesByOptionLabel(
    PARTICIPANT_ATTENDANCE_STATUS
  )?.[0]?.option_values;

  const paymentStatusData = getOptionValuesByOptionLabel(
    PARTICIPANT_PAYMENT_STATUS
  )?.[0]?.option_values;

  const [rowSelection, setRowSelection] = useState({});

  return (
    <div className="m-6 flex flex-col gap-4">
      <div className="ml-auto flex flex-row gap-4">
        <div>
          <Select>
            <SelectTrigger className="w-[254px]">
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItems onBottomReached={() => {}}>
                <SelectItem className="h-[44px]" value="1">
                  Update Attendance Status
                </SelectItem>
                <SelectItem className="h-[44px]" value="2">
                  Update Transaction Status
                </SelectItem>
              </SelectItems>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-[254px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItems onBottomReached={() => {}}>
                <SelectItem className="h-[44px]" value="1">
                  Update Attendance Status
                </SelectItem>
                <SelectItem className="h-[44px]" value="2">
                  Update Transaction Status
                </SelectItem>
              </SelectItems>
            </SelectContent>
          </Select>
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
  );
}

export default CloseRegistrations;

export const participantsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "participant_code",
    enableHiding: false,
    header: () => {
      return <div className="min-w-[150px]">Registration ID</div>;
    },
    cell: ({ row }) => {
      return (
        <div
          onClick={() => {}}
          className="min-w-[150px] text-[#7677F4] font-semibold cursor-pointer"
        >
          {row?.original?.participant_code}
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    enableHiding: false,
    header: () => {
      return <div className="w-[150px]">Participant Name</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="w-[150px]">
          {row?.original?.contact?.full_name
            ? row?.original?.contact?.full_name
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "payment-method",
    enableHiding: false,
    header: () => {
      return <div className="min-w-[150px]">Payment method</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="min-w-[150px]">
          {row?.original?.payment_method?.value
            ? row?.original?.payment_method?.value
            : "-"}
        </div>
      );
    },
  },
  {
    id: "Actions",
    enableHiding: false,
    header: () => {
      return <div className="min-w-[150px]">Required Action (s)</div>;
    },
    cell: () => {
      return <div className="min-w-[150px]">-</div>;
    },
  },
];

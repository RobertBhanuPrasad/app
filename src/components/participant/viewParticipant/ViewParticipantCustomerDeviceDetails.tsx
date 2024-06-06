import { BaseTable } from "@components/course/findCourse/BaseTable";
import { useOne } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { TableHeader, Text } from "src/ui/TextTags";
import { formatDateAndTime } from "src/utility/DateFunctions";
import { useTranslation } from "next-i18next";
// Component for viewing participant customer device details
function ViewParticipantCustomerDeviceDetails({ participantId }: any) {
  const query: any = {
    resource: "participant_registration",
    id: participantId,
    meta: {
      select: "customer_device_details_section", // Selecting specific fields
    },
  };
  const { t } = useTranslation(["course.participants"]);

  // Fetching participant registration data
  const {
    data: participantCustomerDeviceDetailsData,
    isLoading,
    isError,
  } = useOne(query);

  return (
    <div>
      <div>
        <BaseTable
          checkboxSelection={false}
          total={
            participantCustomerDeviceDetailsData?.data
              ?.customer_device_details_section?.length || 0
          }
          pagination={false}
          tableStyles={{
            table: "",
            rowStyles: "",
          }}
          columns={columns()}
          data={
            participantCustomerDeviceDetailsData?.data
              ?.customer_device_details_section || []
          }
          columnPinning={false}
        />
      </div>
    </div>
  );
}

export default ViewParticipantCustomerDeviceDetails;

const columns = () => {
  const { t } = useTranslation(["course.participants"]);

  const columns: ColumnDef<ParticipantCustomerDeviceDetailsDataBaseType>[] = [
    {
      accessorKey: "time_stamp",
      header: () => {
        return (
          <TableHeader>
            {t("course.participants:view_participant.time_stamp")}
          </TableHeader>
        );
      },
      cell: ({ row }) => {
        return <Text>{formatDateAndTime(row?.original?.time_stamp)}</Text>;
      },
    },
    {
      accessorKey: "ip_address",
      header: () => {
        return (
          <TableHeader>
            {t("course.participants:view_participant.ip_address")}
          </TableHeader>
        );
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.ip_address}</Text>;
      },
    },
    {
      accessorKey: "operating_system",
      header: () => {
        return (
          <TableHeader>
            {t("course.participants:view_participant.operating_system")}
          </TableHeader>
        );
      },
      cell: ({ row }) => {
        return (
          <Text className="lowercase">{row?.original?.operating_system}</Text>
        );
      },
    },
    {
      accessorKey: "browser",
      header: () => {
        return (
          <TableHeader>
            {t("course.participants:view_participant.browser")}
          </TableHeader>
        );
      },
      cell: ({ row }) => {
        return <Text className="lowercase">{row?.original?.browser}</Text>;
      },
    },
  ];

  return columns;
};

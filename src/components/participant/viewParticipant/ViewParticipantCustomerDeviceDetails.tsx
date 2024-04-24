import { BaseTable } from "@components/course/findCourse/BaseTable";
import { useOne } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { TableHeader, Text } from "src/ui/TextTags";
import { formatDateAndTime } from "src/utility/DateFunctions";
// Component for viewing participant customer device details
function ViewParticipantCustomerDeviceDetails({ participantId }: any) {
  const query: any = {
    resource: "participant_registration",
    id: participantId,
    meta: {
      select: "customer_device_details_section", // Selecting specific fields
    },
  };

  // Fetching participant registration data
  const {
    data: participantCustomerDeviceDetailsData,
    isLoading,
    isError,
  } = useOne(query);

  return (
    <div>
      <p className="text-[18px] font-[600]">Customer Device Details</p>
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
          columns={columns as ColumnDef<any>[]}
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

const columns: ColumnDef<ParticipantCustomerDeviceDetailsDataBaseType>[] = [
  {
    accessorKey: "program_type",
    header: () => {
      return <TableHeader>Type</TableHeader>;
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.program_type}</Text>;
    },
  },
  {
    accessorKey: "delivery_status",
    header: () => {
      return <TableHeader>Delivery status</TableHeader>;
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.program_type}</Text>;
    },
  },
  {
    accessorKey: "delivery_time_stamp",
    header: () => {
      return <TableHeader>Delivery time Stamp</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <Text className="lowercase">
          {formatDateAndTime(row?.original?.delivery_time_stamp)}
        </Text>
      );
    },
  },
  {
    accessorKey: "source",
    header: () => {
      return <TableHeader>Source</TableHeader>;
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.source}</Text>;
    },
  },
  {
    accessorKey: "open_time_stamp",
    header: () => {
      return <TableHeader>Open time stamp</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <Text className="lowercase">
          {formatDateAndTime(row?.original?.open_time_stamp)}
        </Text>
      );
    },
  },
];

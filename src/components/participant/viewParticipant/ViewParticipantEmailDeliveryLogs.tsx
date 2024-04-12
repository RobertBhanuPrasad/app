import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { TableHeader, Text } from 'src/ui/TextTags'
import { formatDateAndTime } from 'src/utility/DateFunctions'
// Component for viewing participant email delivery logs
function ViewParticipantEmailDeliveryLogs({ participantId }: any) {
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select: 'email_delivery_logs_section' // Selecting specific fields
    }
  }

  // Fetching participant registration data
  const { data: participantEmailDeliveryLogsData, isLoading, isError } = useOne(query)

  const [rowSelection, setRowSelection] = React.useState({})
  return (
    <div>
      <p className="text-[18px] font-[600] mb-[20px]">Email Delivery Logs</p>
      <div>
        <BaseTable
          current={1}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          checkboxSelection={false}
          setCurrent={() => {}}
          pageCount={10}
          total={participantEmailDeliveryLogsData?.data?.email_delivery_logs_section?.length || 0}
          pageSize={10}
          setPageSize={() => {}}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns as ColumnDef<any>[]}
          data={participantEmailDeliveryLogsData?.data?.email_delivery_logs_section || []}
          columnPinning={false}
        />
      </div>
    </div>
  )
}

export default ViewParticipantEmailDeliveryLogs

const columns: ColumnDef<ParticipantEmailDeliveryLogsDataBaseType>[] = [
  {
    accessorKey: 'transaction_id',
    header: () => {
      return <TableHeader>Transaction ID</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.transaction_id}</Text>
    }
  },
  {
    accessorKey: 'time_stamp',
    header: () => {
      return <TableHeader>Time Stamp</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text>{formatDateAndTime(row?.original?.time_stamp)}</Text>
    }
  },
  {
    accessorKey: 'ip_address',
    header: () => {
      return <TableHeader>IP Address</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.ip_address}</Text>
    }
  },
  {
    accessorKey: 'operating_system',
    header: () => {
      return <TableHeader>Operating System</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.operating_system}</Text>
    }
  },
  {
    accessorKey: 'browser',
    header: () => {
      return <TableHeader>Browser</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.browser}</Text>
    }
  }
]

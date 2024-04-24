import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS } from 'src/constants/Tabs'
import { TableHeader, Text } from 'src/ui/TextTags'
import { formatDateAndTime } from 'src/utility/DateFunctions'
// Component for viewing participant email delivery logs
function ViewParticipantEmailDeliveryLogs({ participantId,activeTab }: any) {
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
      <p className={`text-[18px] font-[600]  ${activeTab==VIEW_PARTICIPANT_EMAIL_DELIVERY_LOGS?'text-[#7677F4]':'text-[#333333]'}`}>Email Delivery Logs</p>
      <div>
        <BaseTable
          checkboxSelection={false}
          total={participantEmailDeliveryLogsData?.data?.email_delivery_logs_section?.length || 0}
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
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.transaction_id}</Text>
    }
  },
  {
    accessorKey: 'time_stamp',
    header: () => {
      return <TableHeader>Time Stamp</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{formatDateAndTime(row?.original?.time_stamp)}</Text>
    }
  },
  {
    accessorKey: 'ip_address',
    header: () => {
      return <TableHeader>IP Address</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.ip_address}</Text>
    }
  },
  {
    accessorKey: 'operating_system',
    header: () => {
      return <TableHeader>Operating System</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.operating_system}</Text>
    }
  },
  {
    accessorKey: 'browser',
    header: () => {
      return <TableHeader>Browser</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.browser}</Text>
    }
  }
]

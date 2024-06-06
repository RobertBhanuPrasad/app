import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useTable } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { TableHeader, Text } from 'src/ui/TextTags'
import { formatDateAndTime } from 'src/utility/DateFunctions'
// Component for viewing participant email delivery logs
function ViewParticipantEmailDeliveryLogs({ participantId }: any) {
 

  // Fetching participant registration data
  const { tableQueryResult: participantEmailDeliveryLogsData } = useTable({
    resource: 'registration_email_delivery_logs ',
    filters: {
      permanent: [
        {
          field: 'participant_registration_id',
          operator: 'eq',
          value: participantId
        }
      ]
    }
  })
  
  return (
    <div>
      <div>
        <BaseTable
          checkboxSelection={false}
          total={participantEmailDeliveryLogsData?.data?.data?.length || 0}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns as ColumnDef<any>[]}
          data={participantEmailDeliveryLogsData?.data?.data || []}
          columnPinning={false}
        />
      </div>
    </div>
  )
}

export default ViewParticipantEmailDeliveryLogs

const columns: ColumnDef<ParticipantEmailDeliveryLogsDataBaseType>[] = [
  {
    accessorKey: 'type',
    header: () => {
      return <TableHeader>Type</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.type}</Text>
    }
  },
  {
    accessorKey: 'delivery_status',
    header: () => {
      return <TableHeader>Delivery status</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.delivery_status}</Text>
    }
  },
  {
    accessorKey: 'delivery_time_stamp',
    header: () => {
      return <TableHeader>Delivery time Stamp</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.delivery_time_stamp ? `${row.original.delivery_time_stamp.slice(0,10)} ${row.original.delivery_time_stamp.slice(11,19)}` : '-'}</Text>
    }
  },
  {
    accessorKey: 'source',
    header: () => {
      return <TableHeader>Source</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.source}</Text>
    }
  },
  {
    accessorKey: 'open_time_stamp',
    header: () => {
      return <TableHeader>Open time stamp</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.open_time_stamp ? `${row.original.open_time_stamp.slice(0,10)} ${row.original.open_time_stamp.slice(11,19)}` : '-'}</Text>
    }
  }
]

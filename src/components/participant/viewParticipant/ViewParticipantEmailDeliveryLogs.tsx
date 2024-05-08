import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useTable } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'next-i18next'
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

  const {t} = useTranslation("course.participants")
  
  return (
    <div>
      <p className="text-[18px] font-[600] ">{t('course.participants:view_participant.email_delivery_logs')}</p>
      <div>
        <BaseTable
          checkboxSelection={false}
          total={participantEmailDeliveryLogsData?.data?.data?.length || 0}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns()  as ColumnDef<any>[]}
          data={participantEmailDeliveryLogsData?.data?.data || []}
          columnPinning={false}
        />
      </div>
    </div>
  )
}

export default ViewParticipantEmailDeliveryLogs

const columns = () => {

const {t} = useTranslation("course.participants")

const columns: ColumnDef<ParticipantEmailDeliveryLogsDataBaseType>[] = [
  {
    accessorKey: 'type',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.type')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.type}</Text>
    }
  },
  {
    accessorKey: 'delivery_status',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.delivery_status')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.delivery_status}</Text>
    }
  },
  {
    accessorKey: 'delivery_time_stamp',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.delivery_time_stamp')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.delivery_time_stamp ? `${row.original.delivery_time_stamp.slice(0,10)} ${row.original.delivery_time_stamp.slice(11,19)}` : '-'}</Text>
    }
  },
  {
    accessorKey: 'source',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.source')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.source}</Text>
    }
  },
  {
    accessorKey: 'open_time_stamp',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.open_time_stamp')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.open_time_stamp ? `${row.original.open_time_stamp.slice(0,10)} ${row.original.open_time_stamp.slice(11,19)}` : '-'}</Text>
    }
  }
]

return columns

}

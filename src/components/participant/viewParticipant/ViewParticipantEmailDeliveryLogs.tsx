import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'next-i18next'
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
  const {t} = useTranslation("course.participants")
  return (
    <div>
      <p className="text-[18px] font-[600] ">{t('course.participants:view_participant.email_delivery_logs')}</p>
      <div>
        <BaseTable
          checkboxSelection={false}
          total={participantEmailDeliveryLogsData?.data?.email_delivery_logs_section?.length || 0}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns(t)}
          data={participantEmailDeliveryLogsData?.data?.email_delivery_logs_section || []}
          columnPinning={false}
        />
      </div>
    </div>
  )
}

export default ViewParticipantEmailDeliveryLogs

const columns = (t : any) : ColumnDef<ParticipantEmailDeliveryLogsDataBaseType>[] => [
  {
    accessorKey: 'transaction_id',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.transaction_id')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.transaction_id}</Text>
    }
  },
  {
    accessorKey: 'time_stamp',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.time_stamp')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{formatDateAndTime(row?.original?.time_stamp)}</Text>
    }
  },
  {
    accessorKey: 'ip_address',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.ip_address')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.ip_address}</Text>
    }
  },
  {
    accessorKey: 'operating_system',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.operating_system')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.operating_system}</Text>
    }
  },
  {
    accessorKey: 'browser',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.browser')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.browser}</Text>
    }
  }
]

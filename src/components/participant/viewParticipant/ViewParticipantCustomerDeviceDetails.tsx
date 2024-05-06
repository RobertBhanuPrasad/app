import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import { TableHeader, Text } from 'src/ui/TextTags'
import { formatDateAndTime } from 'src/utility/DateFunctions'
import { useTranslation } from 'next-i18next';
// Component for viewing participant customer device details
function ViewParticipantCustomerDeviceDetails({ participantId }: any) {
    
  
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select: 'customer_device_details_section' // Selecting specific fields
    }
  }
  const {t} = useTranslation(["course.participants"])

  // Fetching participant registration data
  const { data: participantCustomerDeviceDetailsData, isLoading, isError } = useOne(query)
  
 
  return (
    
    <div>
      <p className="text-[18px] font-[600]">{t('course.participants:view_participant.customer_device_details')}</p>
      <div>
        <BaseTable
          checkboxSelection={false}
          total={participantCustomerDeviceDetailsData?.data?.customer_device_details_section?.length || 0}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns (t)}
          data={participantCustomerDeviceDetailsData?.data?.customer_device_details_section || []}
          columnPinning={false}
        />
      </div>
    </div>
  )
}

export default ViewParticipantCustomerDeviceDetails
const columns = (t :any): ColumnDef<ParticipantCustomerDeviceDetailsDataBaseType>[] => [
  
  {
    accessorKey: 'program_type',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.type')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.program_type}</Text>
    }
  },
  {
    accessorKey: 'delivery_status',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.delivery_status')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.program_type}</Text>
    }
  },
  {
    accessorKey: 'delivery_time_stamp',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.delivery_time_stamp')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{formatDateAndTime(row?.original?.delivery_time_stamp)}</Text>
    }
  },
  {
    accessorKey: 'source',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.source')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.source}</Text>
    }
  },
  {
    accessorKey: 'open_time_stamp',
    header: () => {
      return <TableHeader>{t('course.participants:view_participant.open_time_stamp')}</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{formatDateAndTime(row?.original?.open_time_stamp)}</Text>
    }
  }
]

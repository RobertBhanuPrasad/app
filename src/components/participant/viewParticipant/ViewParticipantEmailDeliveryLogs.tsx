import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
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

  console.log('programData', participantEmailDeliveryLogsData?.data)
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

interface Program {
  id: number
  created_at: string
  organization_id: number
  venue_id: number
  registration_link: string
  program_code: string
  program_fee_settings_id: number
  program_type_id: number
  status_id: number
  accommodation_fee_payment_mode: number | null
  center_id: number
  city_id: number
  details_page_link: string
  is_early_bird_enabled: boolean
  is_residential_program: boolean
  program_alias_name_id: number
  program_created_by: number
  state_id: number
  use_default_fee: boolean
}

const columns: ColumnDef<Program>[] = [
  {
    accessorKey: 'transaction_id',
    header: () => {
      return <div className="">Transaction ID</div>
    },

    cell: ({ row }: any) => {
      console.log('row', row)

      return <div className="lowercase">{row?.original?.transaction_id}</div>
    }
  },
  {
    accessorKey: 'time_stamp',
    header: () => {
      return <div className="">Time Stamp</div>
    },

    cell: ({ row }: any) => {
      return <div className="">{formatDateAndTime(row?.original?.time_stamp)}</div>
    }
  },
  {
    accessorKey: 'ip_address',
    header: () => {
      return <div className=" ">IP Address</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.ip_address}</div>
    }
  },
  {
    accessorKey: 'operating_system',
    header: () => {
      return <div className="">Operating System</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.operating_system}</div>
    }
  },
  {
    accessorKey: 'browser',
    header: () => {
      return <div className="">Browser</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase ">{row?.original?.browser}</div>
    }
  }
]

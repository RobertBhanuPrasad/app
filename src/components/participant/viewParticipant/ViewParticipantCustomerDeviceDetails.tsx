import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne, useTable } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
// Component for viewing participant customer device details
function ViewParticipantCustomerDeviceDetails({participantId}:any) {
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select: 'customer_device_details_section' // Selecting specific fields
    }
  };

  // Fetching participant registration data
  const { data: customerDeviceDetailsData, isLoading, isError } = useOne(query);

  const [rowSelection, setRowSelection] = React.useState({});
  return (
    <div>
      <p className="text-[18px] font-[600] mb-[20px]">Customer Device Details</p>
      <div>
      <BaseTable
          current={1}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          checkboxSelection={false}
          setCurrent={() => {}}
          pageCount={10}
          total={customerDeviceDetailsData?.data?.customer_device_details_section?.length || 0}
          pageSize={10}
          setPageSize={() => {}}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns as ColumnDef<any>[]}
          data={customerDeviceDetailsData?.data?.customer_device_details_section || []}
          columnPinning={false}
        />
      </div>
    </div>
  )
}

export default ViewParticipantCustomerDeviceDetails

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
    accessorKey: 'program_type',
    header: () => {
      return <div className="">Type</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.program_type}</div>
    }
  },
  {
    accessorKey: 'delivery_status',
    header: () => {
      return <div className="">Delivery status </div>
    },

    cell: ({ row }: any) => {
      console.log('row innn', row)
      return <div className="">{row?.original?.program_type}</div>
    }
  },
  {
    accessorKey: 'delivery_time_stamp',
    header: () => {
      return <div className="">Delivery time Stamp</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.delivery_time_stamp}</div>
    }
  },
  {
    accessorKey: 'source',
    header: () => {
      return <div className="">Source</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.source}</div>
    }
  },
  {
    accessorKey: 'open_time_stamp',
    header: () => {
      return <div className="">Open time stamp</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.open_time_stamp}</div>
    }
  }
]

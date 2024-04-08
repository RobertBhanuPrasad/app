import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useTable } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
function ViewParticipantEmailDeliveryLogs() {
  const {
    tableQueryResult: programData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent
  } = useTable({
    resource: 'participant_registration',
    meta: {
      select: 'email_delivery_logs_section'
    }
  })
  console.log('programData', programData)
  const [rowSelection, setRowSelection] = React.useState({})
  return (
    <div>
      <p className='text-[18px] font-[600] mb-[20px]'>Email Delivery Logs</p>
      <div>
        <BaseTable
          current={current}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          checkboxSelection={false}
          setCurrent={setCurrent}
          pageCount={pageCount}
          total={programData?.data?.total || 0}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns as ColumnDef<any>[]}
          data={programData?.data?.data || []}
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
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Transaction ID</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">re_3MU29YFiFJJDb8N0JOATa4O</div>
    }
  },
  {
    accessorKey: 'transaction_type',
    header: () => {
      return <div className="">Time Stamp</div>
    },

    cell: ({ row }: any) => {
      console.log('row innn', row)
      return <div className="">Jan 22, 1994 | 01:42:56</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" ">IP Address</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">176.202.107.161</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Operating System</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">Windows 10</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Browser</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase ">Firefox/109.0</div>
    }
  }
]

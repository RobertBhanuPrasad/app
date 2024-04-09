import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useTable } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
function ViewParticipantUtmParameters() {
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
      select: 'utm_parameters_section'
    }
  })
  const [rowSelection, setRowSelection] = React.useState({})
  return (
    <div>
      <p className="text-[18px] font-[600] mb-[20px]">UTM Parameters</p>
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

export default ViewParticipantUtmParameters
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
      return <div className="">ID</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.id}</div>
    }
  },
  {
    accessorKey: 'Source',
    header: () => {
      return <div className="">Source </div>
    },

    cell: ({ row }: any) => {
      console.log('row innn', row)
      return <div className="">{row?.source}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Medium</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.medium}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Campaign</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.campaign}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Term</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.term}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Content</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.content}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">HTTP Refer</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.http_refer}</div>
    }
  }
]

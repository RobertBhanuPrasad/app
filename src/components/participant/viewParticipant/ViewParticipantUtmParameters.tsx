import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne, useTable } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
function ViewParticipantUtmParameters() {

  const selectQuery: any = {
    resource: 'participant_registration',
    id: 4, //TODO:Replace with selected participant ID
    meta: {
      select: 'utm_parameters_section'
    }
  }

  const { data: programData, isLoading, isError } = useOne(selectQuery)

  const [rowSelection, setRowSelection] = React.useState({})
  return (
    <div>
      <p className="text-[18px] font-[600] mb-[20px]">UTM Parameters</p>
      <div>
      <BaseTable
          current={1}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          checkboxSelection={false}
          setCurrent={() => {}}
          pageCount={10}
          total={programData?.data?.utm_parameters_section?.length || 0}
          pageSize={10}
          setPageSize={() => {}}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns as ColumnDef<any>[]}
          data={programData?.data?.utm_parameters_section || []}
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
      return <div className="lowercase">{row?.original?.program_type_id}</div>
    }
  },
  {
    accessorKey: 'source',
    header: () => {
      return <div className="">Source </div>
    },

    cell: ({ row }: any) => {
      return <div className="">{row?.original?.source}</div>
    }
  },
  {
    accessorKey: 'medium',
    header: () => {
      return <div className="">Medium</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.medium}</div>
    }
  },
  {
    accessorKey: 'campaign',
    header: () => {
      return <div className="">Campaign</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.campaign}</div>
    }
  },
  {
    accessorKey: 'term',
    header: () => {
      return <div className="">Term</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.term}</div>
    }
  },
  {
    accessorKey: 'content',
    header: () => {
      return <div className="">Content</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.content}</div>
    }
  },
  {
    accessorKey: 'http_refer',
    header: () => {
      return <div className="">HTTP Refer</div>
    },
    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.http_refer}</div>
    }
  }
]

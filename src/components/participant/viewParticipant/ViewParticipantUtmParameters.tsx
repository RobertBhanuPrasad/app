import { BaseTable } from '@components/course/findCourse/BaseTable'
import { useOne } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { TableHeader, Text } from 'src/ui/TextTags'
// Component for viewing participant UTM parameters
function ViewParticipantUtmParameters({ participantId }: any) {
  const query: any = {
    resource: 'participant_registration',
    id: participantId,
    meta: {
      select: 'utm_parameters_section' // Selecting specific fields
    }
  }

  // Fetching participant registration data
  const { data: utmParametersData, isLoading, isError } = useOne(query)
  const [rowSelection, setRowSelection] = React.useState({})

  return (
    <div>
      <p className="text-[18px] font-[600] ">UTM Parameters</p>
      <div>
        <BaseTable
          current={1}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          checkboxSelection={false}
          setCurrent={() => {}}
          pageCount={10}
          total={utmParametersData?.data?.utm_parameters_section?.length || 0}
          pageSize={10}
          setPageSize={() => {}}
          pagination={false}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns as ColumnDef<any>[]}
          data={utmParametersData?.data?.utm_parameters_section || []}
          columnPinning={false}
        />
      </div>
    </div>
  )
}

export default ViewParticipantUtmParameters

const columns: ColumnDef<ParticipantUtmParametersDataBaseType>[] = [
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <TableHeader>ID</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.program_type_id}</Text>
    }
  },
  {
    accessorKey: 'source',
    header: () => {
      return <TableHeader>Source</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text>{row?.original?.source}</Text>
    }
  },
  {
    accessorKey: 'medium',
    header: () => {
      return <TableHeader>Medium</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.medium}</Text>
    }
  },
  {
    accessorKey: 'campaign',
    header: () => {
      return <TableHeader>Campaign</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.campaign}</Text>
    }
  },
  {
    accessorKey: 'term',
    header: () => {
      return <TableHeader>Term</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.term}</Text>
    }
  },
  {
    accessorKey: 'content',
    header: () => {
      return <TableHeader>Content</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.content}</Text>
    }
  },
  {
    accessorKey: 'http_refer',
    header: () => {
      return <TableHeader>HTTP Refer</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.http_refer}</Text>
    }
  }
]

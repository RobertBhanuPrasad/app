import { BaseTable } from '@components/course/findCourse/BaseTable'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { useTable } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, MoreVertical } from 'lucide-react'
import React from 'react'
import { Button } from 'src/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/ui/dropdown-menu'

function ViewParticipantTransactionDetails() {
  const {
    tableQueryResult: programData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent
  } = useTable({
    resource: 'participant_payment_history',
    meta: {
      select: '*'
    }
  })
  console.log('programData', programData)
  const [rowSelection, setRowSelection] = React.useState({})
  return (
    <div>
      <p className='text-[18px] font-[600] mb-[20px]'>Transaction Details</p>
      <div>
        <BaseTable
          current={current}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          checkboxSelection={true}
          setCurrent={setCurrent}
          pageCount={pageCount}
          total={programData?.data?.total || 0}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pagination={true}
          tableStyles={{
            table: '',
            rowStyles: ''
          }}
          columns={columns as ColumnDef<any>[]}
          data={programData?.data?.data || []}
          columnPinning={true}
        />
      </div>
    </div>
  )
}

export default ViewParticipantTransactionDetails

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
    accessorKey: 'state_id',
    enableHiding: false,
    header: ({ column }) => {
      return (
        <div>
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Transaction Id
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      )
    },

    // This any will be removed after internal dataStructure implementation

    cell: ({ row }: any) => {
      return <div>{row?.original?.state_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[100px]">Time Stamp</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.source_timestamp}</div>
    }
  },
  {
    accessorKey: 'transaction_type',
    header: () => {
      return <div className=" text-center min-w-[150px]">Transaction Type </div>
    },

    cell: ({ row }: any) => {
      console.log('row innn', row)
      return <div className=" text-center min-w-[150px]">{row?.original?.transaction_type}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[150px]">Payment Method</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[170px]">Organization fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center ">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[150px]">Expense fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[100px]">Tax (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center">Discount </div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[170px]">Accommodation Type</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[200px]">Accommodation Fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[120px]">Total fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center ">{row?.original?.total_amount}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[120px]">Fee level</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center min-w-[150px]">Transaction Status</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.payment_transaction_id}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" text-center">Reason</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase text-center">{row?.original?.program_type_id?.name}</div>
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center text-primary">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Copy course</DropdownMenuItem>
              <DropdownMenuItem>Edit Course</DropdownMenuItem>
              <DropdownMenuItem>View Course</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]

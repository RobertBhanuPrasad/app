import { BaseTable } from '@components/course/findCourse/BaseTable'; // Importing BaseTable component for displaying table
import { CaretSortIcon } from '@radix-ui/react-icons'; // Importing CaretSortIcon for sorting indicator
import { useTable } from '@refinedev/core'; // Importing useTable hook for fetching table data
import { ColumnDef } from '@tanstack/react-table'; // Importing ColumnDef type for defining table columns
import { ArrowDownIcon, ArrowUpIcon, MoreVertical } from 'lucide-react'; // Importing icons for UI
import React from 'react'; // Importing React
import { Button } from 'src/ui/button'; // Importing Button component
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/ui/dropdown-menu'; // Importing components for dropdown menu

// Component for viewing participant transaction details
function ViewParticipantTransactionDetails({participantId}:any) {
  // Fetching table data using useTable hook
  let {
    tableQueryResult: participantTransactionDetailsData, // Table data result
    pageCount, // Number of pages
    pageSize, // Number of items per page
    setPageSize, // Function to set page size
    current, // Current page number
    setCurrent // Function to set current page number
  } = useTable({
    resource: 'participant_payment_history', // Resource name for fetching data
    meta: {
      select: '*,transaction_type_id(*),payment_method_id(*),transaction_fee_level_id(*),transaction_status_id(*)' // Selecting specific fields
    },
    filters: {
      permanent: [
        {
          field: 'participant_id',
          operator: 'eq',
          value: participantId 
        }
      ]
    }
  });

  // State variable for row selection
  const [rowSelection, setRowSelection] = React.useState({});

  return (
    <div>
      <p className="text-[18px] font-[600] mb-[20px]">Transaction Details</p>
      <div className="!min-w-[1000px] rounded-[10px]">
        {/* BaseTable component for rendering table */}
        <BaseTable
          current={current}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          checkboxSelection={false}
          setCurrent={setCurrent}
          pageCount={pageCount}
          total={participantTransactionDetailsData?.data?.total || 0} // Total number of items
          pageSize={pageSize}
          setPageSize={setPageSize}
          pagination={true} // Enable pagination
          tableStyles={{
            table: ' !rounded-3xl', // Custom table styles
            rowStyles: '' // Custom row styles
          }}
          columns={columns as ColumnDef<any>[]} // Table columns
          data={participantTransactionDetailsData?.data?.data || []} // Table data
          columnPinning={true} // Enable column pinning
        />
      </div>
    </div>
  );
}

export default ViewParticipantTransactionDetails;

// TypeScript interface for defining program object structure
interface Program {
  id: number;
  created_at: string;
  organization_id: number;
  venue_id: number;
  registration_link: string;
  program_code: string;
  program_fee_settings_id: number;
  program_type_id: number;
  status_id: number;
  accommodation_fee_payment_mode: number | null;
  center_id: number;
  city_id: number;
  details_page_link: string;
  is_early_bird_enabled: boolean;
  is_residential_program: boolean;
  program_alias_name_id: number;
  program_created_by: number;
  state_id: number;
  use_default_fee: boolean;
}

// Array of table columns
const columns: ColumnDef<Program>[] = [
  {
    accessorKey: 'payment_transaction_id',
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
      return <div>{row?.original?.payment_transaction_id}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="  min-w-[100px]">Time Stamp</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase ">{row?.original?.source_timestamp}</div>
    }
  },
  {
    accessorKey: 'transaction_type',
    header: () => {
      return <div className="  min-w-[150px]">Transaction Type </div>
    },

    cell: ({ row }: any) => {
      return (
        <div
          className={`  min-w-[150px] ${
            row?.original?.transaction_status_id == 8 ? 'text-[#FF6D6D]' : 'text-[#7677F4]'
          }`}
        >
          {row?.original?.transaction_type_id?.value}
        </div>
      )
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="min-w-[150px]">Payment Method</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.payment_method_id?.value}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[170px]">Organization fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase ">{row?.original?.organization_fee}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[150px]">Expense fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[100px]">Tax (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.expense_fee}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Discount </div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.program_type_id?.name}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[170px]">Accommodation Type</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.accommodation_type}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[200px]">Accommodation Fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.accommodation_fee}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[120px]">Total fee (EUR)</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase ">{row?.original?.total_amount}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[120px]">Fee level</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase ">{row?.original?.transaction_fee_level_id?.value}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className=" min-w-[150px]">Transaction Status</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.transaction_status_id?.value}</div>
    }
  },
  {
    accessorKey: 'program_type_id',
    header: () => {
      return <div className="">Reason</div>
    },

    cell: ({ row }: any) => {
      return <div className="lowercase">{row?.original?.transaction_reason}</div>
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const editParticipant = () => {}
      const viewParticipant = () => {}
      const refundTransaction = () => {}
      const downloadReceipt = () => {}
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
              <div
                onClick={() => {
                  editParticipant()
                }}
              >
                {' '}
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </div>
              <div
                onClick={() => {
                  viewParticipant()
                }}
              >
                <DropdownMenuItem>View</DropdownMenuItem>
              </div>
              <div
                onClick={() => {
                  refundTransaction()
                }}
              >
                <DropdownMenuItem>Refund</DropdownMenuItem>
              </div>
              <div
                onClick={() => {
                  downloadReceipt()
                }}
              >
                {' '}
                <DropdownMenuItem>Download receipt</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]

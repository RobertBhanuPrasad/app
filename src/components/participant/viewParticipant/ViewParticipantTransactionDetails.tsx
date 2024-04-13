import { BaseTable } from '@components/course/findCourse/BaseTable' // Importing BaseTable component for displaying table
import { CaretSortIcon } from '@radix-ui/react-icons' // Importing CaretSortIcon for sorting indicator
import { useTable } from '@refinedev/core' // Importing useTable hook for fetching table data
import { ColumnDef } from '@tanstack/react-table' // Importing ColumnDef type for defining table columns
import { ArrowDownIcon, ArrowUpIcon, MoreVertical } from 'lucide-react' // Importing icons for UI
import React from 'react' // Importing React
import { PARTICIPANT_PAYMENT_STATUS } from 'src/constants/OptionLabels'
import { PARTICIPANT_PENDING_PAYMENT_STATUS } from 'src/constants/OptionValueOrder'
import { TableHeader, Text } from 'src/ui/TextTags'
import { Button } from 'src/ui/button' // Importing Button component
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/ui/dropdown-menu' // Importing components for dropdown menu
import { formatDateAndTime } from 'src/utility/DateFunctions'
import { getOptionValueObjectByOptionOrder } from 'src/utility/GetOptionValuesByOptionLabel'

// Component for viewing participant transaction details
function ViewParticipantTransactionDetails({ participantId }: any) {
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
      select:
        '*,transaction_type_id(*),payment_method_id(*),transaction_fee_level_id(*),transaction_status_id(*),accommodation_type_id(*,accommodation_type_id(*))' // Selecting specific fields
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
  })

  // State variable for row selection
  const [rowSelection, setRowSelection] = React.useState({})

  return (
    <div>
      <p className="text-[18px] font-[600] ">Transaction Details</p>
      <div className="!w-[1133px] rounded-[10px]">
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
          pagination={false} // Enable pagination
          tableStyles={{
            table: ' !rounded-3xl rounded-md', // Custom table styles
            rowStyles: '' // Custom row styles
          }}
          columns={columns as ColumnDef<any>[]} // Table columns
          data={participantTransactionDetailsData?.data?.data || []} // Table data
          columnPinning={true} // Enable column pinning
        />
      </div>
    </div>
  )
}

export default ViewParticipantTransactionDetails

// Array of table columns
const columns: ColumnDef<ParticipantPaymentHistoryDataBaseType>[] = [
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
    accessorKey: 'created_at',
    header: () => {
      return <TableHeader className="  min-w-[100px]">Time Stamp</TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase ">{formatDateAndTime(row?.original?.created_at)}</Text>
    }
  },
  {
    accessorKey: 'transaction_type_id',
    header: () => {
      return <TableHeader className="  min-w-[150px]">Transaction Type </TableHeader>
    },

    cell: ({ row }: any) => {
      const participantPendingPaymentStatusId = getOptionValueObjectByOptionOrder(
        PARTICIPANT_PAYMENT_STATUS,
        PARTICIPANT_PENDING_PAYMENT_STATUS
      )?.id
      return (
        <Text
          className={`  min-w-[150px] ${
            row?.original?.transaction_status_id == participantPendingPaymentStatusId
              ? 'text-[#FF6D6D]'
              : 'text-[#7677F4]'
          }`}
        >
          {row?.original?.transaction_type_id?.value}
        </Text>
      )
    }
  },
  {
    accessorKey: 'payment_method_id',
    header: () => {
      return <TableHeader className="min-w-[150px]">Payment Method</TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.payment_method_id?.value}</Text>
    }
  },
  {
    accessorKey: 'organization_fee',
    header: () => {
      return <TableHeader className=" min-w-[170px]">Organization fee (EUR)</TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase ">{row?.original?.organization_fee}</Text>
    }
  },
  {
    accessorKey: 'expense_fee',
    header: () => {
      return <TableHeader className=" min-w-[150px]">Expense fee (EUR)</TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.expense_fee}</Text>
    }
  },
  {
    accessorKey: 'tax',
    header: () => {
      return <TableHeader className=" min-w-[100px]">Tax (EUR)</TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.tax}</Text>
    }
  },
  {
    accessorKey: 'discounted_amount',
    header: () => {
      return <TableHeader className="">Discount </TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.discounted_amount}</Text>
    }
  },
  {
    accessorKey: 'accommodation_type',
    header: () => {
      return <TableHeader className=" min-w-[170px]">Accommodation Type</TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.accommodation_type_id?.accommodation_type_id?.name}</Text>
    }
  },
  {
    accessorKey: 'accommodation_fee',
    header: () => {
      return <TableHeader className=" min-w-[200px]">Accommodation Fee (EUR)</TableHeader>
    },

    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.accommodation_type_id?.fee_per_person}</Text>
    }
  },
  {
    accessorKey: 'total_amount',
    header: () => {
      return <TableHeader className="min-w-[120px]">Total fee (EUR)</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.total_amount}</Text>
    }
  },
  {
    accessorKey: 'transaction_fee_level_id',
    header: () => {
      return <TableHeader className="min-w-[120px]">Fee level</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.transaction_fee_level_id?.value}</Text>
    }
  },
  {
    accessorKey: 'transaction_status_id',
    header: () => {
      return <TableHeader className="min-w-[150px]">Transaction Status</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.transaction_status_id?.value}</Text>
    }
  },
  {
    accessorKey: 'transaction_reason',
    header: () => {
      return <TableHeader>Reason</TableHeader>
    },
    cell: ({ row }: any) => {
      return <Text className="lowercase">{row?.original?.transaction_reason}</Text>
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

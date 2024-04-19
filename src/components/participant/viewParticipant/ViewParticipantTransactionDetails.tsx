import { BaseTable } from '@components/course/findCourse/BaseTable' // Importing BaseTable component for displaying table
import TransactionActivity from '@components/participants/TransactionActivityPopover'
import EditPayment from '@components/participants/editParticipant/editPayment'
import ViewDonationDetails from '@components/participants/editParticipant/viewDonationDetails'
import TransactionActivityIcon from '@public/assets/TransactionActivityIcon'
import { CaretSortIcon } from '@radix-ui/react-icons' // Importing CaretSortIcon for sorting indicator
import { useTable } from '@refinedev/core' // Importing useTable hook for fetching table data
import { ColumnDef } from '@tanstack/react-table' // Importing ColumnDef type for defining table columns
import { ArrowDownIcon, ArrowUpIcon, MoreVertical } from 'lucide-react' // Importing icons for UI
import { useState } from 'react' // Importing React
import { PARTICIPANT_PAYMENT_STATUS } from 'src/constants/OptionLabels'
import { PARTICIPANT_PENDING_PAYMENT_STATUS } from 'src/constants/OptionValueOrder'
import { TableHeader, Text } from 'src/ui/TextTags'
import { Button } from 'src/ui/button' // Importing Button component
import { Dialog, DialogContent, DialogTrigger } from 'src/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from 'src/ui/dropdown-menu' // Importing components for dropdown menu
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

  console.log('participantTransactionDetailsData', participantTransactionDetailsData)

  return (
    <div>
      <div className="flex">
        <p className="text-[18px] font-[600] pr-[10px] ">Transaction Details</p>
        <div className="cursor-pointer">
          <div className="text-left">
            <TransactionActivity
              transactionHistory={participantTransactionDetailsData?.data?.data}
              renderHeader={<TransactionActivityIcon />}
            />
          </div>
        </div>
      </div>
      <div className="!w-[1000px] rounded-[10px]">
        {/* BaseTable component for rendering table */}
        <BaseTable
          checkboxSelection={false}
          total={participantTransactionDetailsData?.data?.total || 0} // Total number of items
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

    cell: ({ row }) => {
      return <div>{row?.original?.payment_transaction_id}</div>
    }
  },
  {
    accessorKey: 'created_at',
    header: () => {
      return <TableHeader className="  min-w-[100px]">Time Stamp</TableHeader>
    },

    cell: ({ row }) => {
      return <Text className="lowercase ">{formatDateAndTime(row?.original?.created_at)}</Text>
    }
  },
  {
    accessorKey: 'transaction_type_id',
    header: () => {
      return <TableHeader className="  min-w-[150px]">Transaction Type </TableHeader>
    },

    cell: ({ row }) => {
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

    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.payment_method_id?.value}</Text>
    }
  },
  {
    accessorKey: 'organization_fee',
    header: () => {
      return <TableHeader className=" min-w-[170px]">Organization fee (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text className="lowercase ">{row?.original?.organization_fee}</Text>
    }
  },
  {
    accessorKey: 'expense_fee',
    header: () => {
      return <TableHeader className=" min-w-[150px]">Expense fee (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.expense_fee}</Text>
    }
  },
  {
    accessorKey: 'tax',
    header: () => {
      return <TableHeader className=" min-w-[100px]">Tax (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.tax}</Text>
    }
  },
  {
    accessorKey: 'discounted_amount',
    header: () => {
      return <TableHeader className="">Discount </TableHeader>
    },

    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.discounted_amount}</Text>
    }
  },
  {
    accessorKey: 'accommodation_type',
    header: () => {
      return <TableHeader className=" min-w-[170px]">Accommodation Type</TableHeader>
    },

    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.accommodation_type_id?.accommodation_type_id?.name}</Text>
    }
  },
  {
    accessorKey: 'accommodation_fee',
    header: () => {
      return <TableHeader className=" min-w-[200px]">Accommodation Fee (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.accommodation_type_id?.fee_per_person}</Text>
    }
  },
  {
    accessorKey: 'total_amount',
    header: () => {
      return <TableHeader className="min-w-[120px]">Total fee (EUR)</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.total_amount}</Text>
    }
  },
  {
    accessorKey: 'transaction_fee_level_id',
    header: () => {
      return <TableHeader className="min-w-[120px]">Fee level</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.transaction_fee_level_id?.value}</Text>
    }
  },
  {
    accessorKey: 'transaction_status_id',
    header: () => {
      return <TableHeader className="min-w-[150px]">Transaction Status</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.transaction_status_id?.value}</Text>
    }
  },
  {
    accessorKey: 'transaction_reason',
    header: () => {
      return <TableHeader>Reason</TableHeader>
    },
    cell: ({ row }) => {
      return <Text className="lowercase">{row?.original?.transaction_reason}</Text>
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const refundTransaction = () => {}

      const [editPayment, setEditPayment] = useState(false)
      const [viewDonation, setViewDonation] = useState(false)
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
              <div className="p-[10px]">
                {/* Edit Payment option */}
                <div>
                  <div className="p-[5px]">
                    <Dialog open={editPayment} onOpenChange={setEditPayment}>
                      <DialogTrigger asChild>
                        <div
                          onClick={() => {
                            setEditPayment(true)
                          }}
                        >
                          Edit
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <EditPayment setEditPayment={setEditPayment} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {/* View Donation option */}
                <div>
                  <div className="p-[5px]">
                    <Dialog open={viewDonation} onOpenChange={setViewDonation}>
                      <DialogTrigger asChild>
                        <div
                          onClick={() => {
                            setViewDonation(true)
                          }}
                        >
                          View
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <ViewDonationDetails setViewDonation={setViewDonation} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div
                  onClick={() => {
                    refundTransaction()
                  }}
                >
                  <div className="p-[5px]">Refund</div>
                </div>
                <div>
                  <div className="p-[5px]">Download Receipt</div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]

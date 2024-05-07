import Form from "@components/Formfield";
import { BaseTable } from "@components/course/findCourse/BaseTable"; // Importing BaseTable component for displaying table
import TransactionActivity from "@components/participants/TransactionActivityPopover";
import { handleEditPaymentValues } from "@components/participants/editParticipant/EditParticipantUtil";
import EditPayment from "@components/participants/editParticipant/editPayment";
import ViewDonationDetails from "@components/participants/editParticipant/viewDonationDetails";
import TransactionActivityIcon from "@public/assets/TransactionActivityIcon";
import { useTable } from "@refinedev/core"; // Importing useTable hook for fetching table data
import { ColumnDef } from "@tanstack/react-table"; // Importing ColumnDef type for defining table columns
import { MoreVertical } from "lucide-react"; // Importing icons for UI
import { useRouter } from "next/router";
import { useEffect, useState } from "react"; // Importing React
import { translatedText } from "src/common/translations";
import { PARTICIPANT_PAYMENT_STATUS } from "src/constants/OptionLabels";
import { PARTICIPANT_PENDING_PAYMENT_STATUS } from "src/constants/OptionValueOrder";
import { TableHeader, Text } from "src/ui/TextTags";
import { Button } from "src/ui/button"; // Importing Button component
import { Dialog, DialogContent, DialogTrigger } from "src/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu"; // Importing components for dropdown menu
import { formatDateAndTime } from "src/utility/DateFunctions";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
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
      <div className="w-full rounded-[10px] ">
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
    header: () => {
      return <TableHeader className="  min-w-[100px]">Transaction ID</TableHeader>
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
      return <Text>{formatDateAndTime(row?.original?.created_at)}</Text>
    }
  },
  {
    accessorKey: 'transaction_type_id',
    header: () => {
      return <TableHeader className="min-w-[150px]">Transaction Type </TableHeader>
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
          {translatedText(row?.original?.transaction_type_id?.name as object)}
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
      return (
        <Text>
          {row?.original?.sub_payment_method}
        </Text>
      );
    },
  },
  {
    accessorKey: 'organization_fee',
    header: () => {
      return <TableHeader className=" min-w-[170px]">Organization fee (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text>{row?.original?.organization_fee?.toFixed(2)}</Text>
    }
  },
  {
    accessorKey: 'expense_fee',
    header: () => {
      return <TableHeader className=" min-w-[150px]">Expense fee (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text>{row?.original?.expense_fee ? row?.original?.expense_fee?.toFixed(2) : '-'}</Text>
    }
  },
  {
    accessorKey: 'tax',
    header: () => {
      return <TableHeader className=" min-w-[100px]">Tax (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text>{row?.original?.tax?.toFixed(2)}</Text>
    }
  },
  {
    accessorKey: 'discounted_amount',
    header: () => {
      return <TableHeader>Discount </TableHeader>
    },

    cell: ({ row }) => {
        const organizationFee = row?.original?.organization_fee ? row?.original?.organization_fee : 0
        const accomdationFee = row?.original?.accommodation_fee ? row?.original?.accommodation_fee : 0
        const tax = row?.original?.tax ? row?.original?.tax : 0
        const amountPaidByParticipant = organizationFee + accomdationFee + tax
        const totalAmount = row?.original?.total_amount ? row?.original?.total_amount : 0
        const discount = (amountPaidByParticipant - totalAmount).toFixed(2)
      return (
        <Text>{discount}</Text>
      );
    },
  },
  {
    accessorKey: 'accommodation_type',
    header: () => {
      return <TableHeader className=" min-w-[170px]">Accommodation Type</TableHeader>
    },

    cell: ({ row }) => {
      return <Text>{row?.original?.accommodation_type_id ? translatedText(row?.original?.accommodation_type_id?.accommodation_type_id?.name as object) : '-'}</Text>
    }
  },
  {
    accessorKey: 'accommodation_fee',
    header: () => {
      return <TableHeader className=" min-w-[200px]">Accommodation Fee (EUR)</TableHeader>
    },

    cell: ({ row }) => {
      return <Text>{row?.original?.accommodation_fee ? row?.original?.accommodation_fee?.toFixed(2) : '-'}</Text>
    }
  },
  {
    accessorKey: 'total_amount',
    header: () => {
      return <TableHeader className="min-w-[120px]">Total fee (EUR)</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.total_amount?.toFixed(2)}</Text>
    }
  },
  {
    accessorKey: 'source',
    header: () => {
      return <TableHeader className="min-w-[120px]">Source</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.source_text ? row?.original?.source_text : '-'}</Text>
    }
  },
  {
    accessorKey: 'transaction_fee_level_id',
    header: () => {
      return <TableHeader className="min-w-[120px]">Fee level</TableHeader>
    },
    cell: ({ row }) => {
      return (
        <Text>
          {translatedText(row?.original?.transaction_fee_level_id?.name as object)}
        </Text>
      );
    },
  },
  {
    accessorKey: 'transaction_status_id',
    header: () => {
      return <TableHeader className="min-w-[150px]">Transaction Status</TableHeader>
    },
    cell: ({ row }) => {
      return (
        <Text>
          {translatedText(row?.original?.transaction_status_id?.name as object)}
        </Text>
      );
    },
  },
  {
    accessorKey: 'transaction_reason',
    header: () => {
      return <TableHeader>Reason</TableHeader>
    },
    cell: ({ row }) => {
      return <Text>{row?.original?.transaction_reason ? row?.original?.transaction_reason : '-'}</Text>
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const refundTransaction = () => {}

      const [editPayment, setEditPayment] = useState(false)
      const [viewDonation, setViewDonation] = useState(false)
      const { query } = useRouter()
      const [defaultValues, setDefaultValues] = useState({})
      const [dropdownOpen, setDropdownOpen] = useState(false) //added a dropdownOpen state to control the visibility of the dropdown content.

      // Function to close the dropdown menu by setting the dropdownOpen state to false
      const closeDropdown = () => {
        setDropdownOpen(false)
      }

      const Id: number | undefined = query?.participantId ? parseInt(query.participantId as string) : undefined

      useEffect(() => {
        async function fetchData() {
          try {
            const values = await handleEditPaymentValues(Number(row?.original?.id))
            setDefaultValues(values)
          } catch (error) {
            console.error('An error occurred:', error)
          }
        }

        if (Id) {
          fetchData()
        }
      }, [Id])
      return (
        <div className="flex justify-center text-primary">
          <div>
            <div className="p-[5px] cursor-pointer hover:bg-[#7677F4]/[0.1] rounded-sm">
              <Dialog open={editPayment}>
                <DialogTrigger asChild={editPayment}></DialogTrigger>
                <Form onSubmit={() => {}} defaultValues={defaultValues}>
                  {/* Edit payment component accepts payment history id as paymentID and setEditPayment function to handle open or close state */}
                  <EditPayment paymentId={Number(row?.original?.id)} setEditPayment={setEditPayment} />
                </Form>
              </Dialog>
            </div>
          </div>

          {/* View Donation option */}
          <div>
            <div className="p-[5px] cursor-pointer hover:bg-[#7677F4]/[0.1] rounded-sm ">
              <Dialog open={viewDonation} onOpenChange={setViewDonation}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                  <ViewDonationDetails setViewDonation={setViewDonation} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <DropdownMenu open={dropdownOpen}>
            <DropdownMenuTrigger asChild={dropdownOpen}>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen)
                }}
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            {/* TODO: need to fix UI issue, on option hover option must be highlighted, tried using dropdownItmes tag, but behaving unwantedly, that's why removed dropdownItmes tag and replaced iwth div tags */}
            <DropdownMenuContent align="end" asChild={true}>
              <div className="p-[10px]">
                <div
                  onClick={() => {
                    setEditPayment(true)
                    closeDropdown()
                  }}
                  className="p-[5px] hover:bg-[#7677F4]/[0.1] rounded-sm cursor-pointer"
                >
                  Edit
                </div>
                <div
                  onClick={() => {
                    setViewDonation(true)
                    closeDropdown()
                  }}
                  className="p-[5px] hover:bg-[#7677F4]/[0.1] rounded-sm cursor-pointer"
                >
                  View
                </div>
                <div
                  onClick={() => {
                    closeDropdown()
                    refundTransaction()
                  }}
                >
                  <div className="p-[5px] hover:bg-[#7677F4]/[0.1] rounded-sm cursor-pointer">Refund</div>
                </div>
                <div
                  onClick={() => {
                    closeDropdown()
                  }}
                >
                  <div className="p-[5px] hover:bg-[#7677F4]/[0.1] rounded-sm cursor-pointer">Download Receipt</div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]

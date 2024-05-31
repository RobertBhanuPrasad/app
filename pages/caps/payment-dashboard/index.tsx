import { BaseTable } from "@components/course/findCourse/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { TableHeader, Text } from "src/ui/TextTags";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "src/ui/dropdown-menu";
import { supabaseClient } from "src/utility";
import { newCourseStore } from "src/zustandStore/NewCourseStore";

const PaymentDashboard = () => {

  const { setPaymentGatewaysData, paymentGatewaysData } = newCourseStore()

  const router = useRouter();

  const supabase = supabaseClient("caps");

  const getPaymentGatewayData = async () => {
    const { data: paymentGatewayData } = await supabase
      .from("payment_gateways")
      .select("id,type,name,description,test,transaction_intent,enabled")
    if (paymentGatewayData) {
      const sortedPaymentGatewayData = _.sortBy(paymentGatewayData, "id")
      setPaymentGatewaysData(sortedPaymentGatewayData)
    }
  }

  useEffect(() => {
    getPaymentGatewayData()
  }, [])

  return (
    <div>
      <div className="flex justify-center font-semibold"> Payment Gateway Dashboard</div>
      <div className="mx-6 mt-[-25px] mb-8">
        <BaseTable
          columns={pgDashboardColumns}
          data={paymentGatewaysData || []}
          tableStyles={{
            table: "",
            rowStyles: "!important border-none",
          }}
          columnPinning={true}
        >
        </BaseTable>
      </div>
      <div className="flex justify-between mx-6">
        <div> The above is the list of Payment Gateways configured in CAPS</div>
        <div className="mb-4"><Button onClick={() => router.push('/caps/add-payment')}>Add Gateway</Button></div>
      </div>
    </div>
  )
}

PaymentDashboard.noLayout = false;

export default PaymentDashboard

type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

const pgDashboardColumns: ExtendedColumnDef<any>[] = [
  {
    accessorKey: "id",
    column_name: "pG ID",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[80px]">PG ID</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title={row?.original?.id}>
          <Text className="max-w-[80px] truncate">{"# " + row?.original?.id}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "type",
    column_name: "pG Type",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">PG Type</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title={row?.original?.type}>
          <Text className="max-w-[150px] truncate">{row?.original?.type}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "name",
    column_name: "Name",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Name</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title={row?.original?.name}>
          <Text className="max-w-[150px] truncate">{row?.original?.name}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "description",
    column_name: "Description",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Description</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title={row?.original?.description}>
          <Text className="max-w-[150px] truncate">{row?.original?.description}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "gateway",
    column_name: "Test Gateway",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Test Gateway</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title="ID">
          <Text className="max-w-[150px] truncate">{row?.original?.test ? "Yes" : "No"}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "purpose",
    column_name: "Gateway Purpose (Sale/Refund)",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Gateway Purpose (Sale/Refund)</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title="ID">
          <Text className="max-w-[150px] truncate">{row?.original?.transaction_intent ? "Refund" : "Sale"}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "status",
    column_name: "status",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Status</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <StatusCheckBox index={row?.original?.id} />
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {

      const router = useRouter();

      const { setPaymentGatewaysData, paymentGatewaysData } = newCourseStore()

      const menuData: {
        label: string,
        value: number
      }[] = [
          {
            label: "Edit",
            value: 1
          },
          {
            label: "Delete",
            value: 2
          }
        ]

      function checkSuccess(message: string) {
        const regex = /deleted successfully/;
        return (message.match(regex) ? true : false);
      }

      const supabase = supabaseClient("caps")

      const handleDeletePaymentGateway = async () => {
        const { data, error } = await supabase
          .rpc('delete_gateway', { _id: row?.original?.id });

        // Construct the message based on the RPC response
        const message = error ? JSON.stringify(error) : JSON.stringify(data);

        // Check if the response is not ok or if the checkSuccess function returns false
        if (error || !checkSuccess(message)) {
          alert(JSON.stringify({ title: "Delete Error", description: "Could not delete the payment gateway: " + message }));
          return;
        } else {
          const updatedGateways = _.cloneDeep(paymentGatewaysData); // Clone the array to avoid mutating state directly
          _.remove(updatedGateways, { id: row?.original?.id }); // Remove the gateway with the specified id

          setPaymentGatewaysData(updatedGateways); // Update the state with the new array
        }
      }

      const handleEditPaymentGateway = () => {
        router.push(`/caps/${row?.original?.id}/edit-payment`)
      }

      const handleSelectedValue = (value: number) => {
        if (value == 1) {
          handleEditPaymentGateway()
        }
        else if (value == 2) {
          handleDeletePaymentGateway()
        }
      }

      return (
        <div>
          <div className="pl-[1px]">
            <div className="flex justify-center text-primary">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 ">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <p>
                    {menuData &&
                      menuData.map((data: { label: string, value: number }) => (
                        <DropdownMenuItem
                          key={data.value}
                          onClick={() => {
                            handleSelectedValue(data.value);
                          }}
                        >
                          {data.label}
                        </DropdownMenuItem>
                      ))}
                  </p>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )
    }
  }
]


const StatusCheckBox = ({ index }: { index: number }) => {

  const { setPaymentGatewaysData, paymentGatewaysData } = newCourseStore()

  const supabase = supabaseClient("caps")

  const togglePG = async (newStatus: boolean) => {
    const { error } = await supabase
      .from("payment_gateways")
      .update({ enabled: newStatus })
      .eq("id", index)

    if (error) {
      alert(JSON.stringify({ title: "Update Error", description: "Could not update the table. Please try again after some time." + error }, null, 2));
      return;
    } else {
      const updatedData = _.map(paymentGatewaysData, (obj) =>
        obj.id === index ? {
          ...obj,
          enabled: newStatus
        } : obj
      );
      setPaymentGatewaysData(updatedData)
    }
  }
  const getCheckedStatus = () => {
    const findObject = _.find(paymentGatewaysData, { id: index })
    return findObject?.enabled
  }

  return (
    <div>
      <Checkbox checked={getCheckedStatus()} onCheckedChange={togglePG} className="w-6 h-6  border-[#D0D5DD]" />
    </div>
  )
}



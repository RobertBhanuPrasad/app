import { Table, TableCell, TableHead, TableRow } from 'src/ui/table'
import React, { useEffect, useState } from 'react'
import { TableHeader } from 'src/ui/table'
import { TableBody } from 'src/ui/table'
import "bootstrap/dist/css/bootstrap.min.css";
import { customFetch } from 'src/utility/custom-fetch';
import { BaseTable } from '@components/course/findCourse/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { supabaseClient } from 'src/utility/supabaseClient';
import { capsAdminStore } from 'src/zustandStore/CapsAdminStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/ui/dropdown-menu';
import { Button } from 'src/ui/button';
import { MoreVertical } from 'lucide-react';
import _ from 'lodash';


const CapsDashboard = () => {

const [data, setData] = useState([]);

useEffect(() => {
    const getData = async () => {
        try {
            const response = await customFetch("/rest/v1/pg_entity", "GET");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            setData(responseData);
            console.log(responseData);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    getData();
}, []);

    return (<>
        <h1 className='pd-5 mb-3 text-center bg-body-tertiary'>
            Entity DashBoard
        </h1>
        
        <div className="mx-6 mb-8 bg-white">
            <BaseTable
              columns={pgDashboardColumns}
              data={data || []}
              tableStyles={{
                table: "",
                rowStyles: "!important border-none",
              }}
              columnPinning={true}
            />
          </div> 
    </>
    )
}

export default CapsDashboard

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
            
          </abbr>
        );
      },
    },
  
   
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
  
        const router = useRouter();
  
        const { setPaymentGatewaysData, paymentGatewaysData } = capsAdminStore()
  
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
            // alert(JSON.stringify({ title: "Delete Error", description: "Could not delete the payment gateway: " + message }));
            alert("Delete Error :  Could not delete the payment gateway: " + message);
            return;
          } else {
            const updatedGateways = _.cloneDeep(paymentGatewaysData); // Clone the array to avoid mutating state directly
            _.remove(updatedGateways, { id: row?.original?.id }); // Remove the gateway with the specified id
  
            setPaymentGatewaysData(updatedGateways); // Update the state with the new array
          }
        }
  
        const handleEditPaymentGateway = () => {
          router.push(`/caps/edit-payment?id=${row?.original?.id}`)
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
                            // onClick={() => {
                            //   handleSelectedValue(data.value);
                            // }}
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

import React, { useEffect, useState } from 'react'
import { TableHeader, Text } from 'src/ui/TextTags'
import { BaseTable } from '@components/course/findCourse/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import router from 'next/router';
import { supabaseClient } from 'src/utility/supabaseClient';
import { FaEdit, FaTrash } from 'react-icons/fa';
import _ from 'lodash';
import { Button } from 'src/ui/button';
import { useTable } from '@refinedev/core';


// Define the interface for the data structure
interface PgEntity {
  id: number;
  name: string;
  country: string;
  org: number
}

const EntityDashboard = () => {
  const {
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
    tableQueryResult: { data: programData },
  } = useTable<PgEntity>({
    resource: 'pg_entity',
    meta: {
      select: '*',
    },
    pagination: {
      pageSize: 10,
    },
  });
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<PgEntity[]>([]);
  const supabase = supabaseClient('caps')
  // useEffect(() => {
  //   if (programData?.data) {
  //     setData(programData.data);
  //   }
  // }, [programData]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        const { data: responseData, error } = await supabase
          .from('pg_entity')
          .select('*')
          .order("id", { ascending: true });
        if (error) {
          throw error
        }
        setData(responseData)
        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);


  return (<>
    <div className='px-6' >
      <h1 className='p-2 mb-3 text-center bg-gray-100 font-bold text-4xl text-gray-800'>
        Entity DashBoard
      </h1>
    </div>
    {isLoading ? (
      <section className="flex justify-center align-center pt-[10%]">
        <div className="loader"></div>
      </section>
    ) : (
      <div className="mx-6 mb-8 bg-white">
        <BaseTable
          pageCount={pageCount}
          pageSize={pageSize}
          pagination={true}
          current={current}
          setCurrent={setCurrent}
          columns={entityDashboardColumns}
          data={data || []}
          setPageSize={setPageSize}
          tableStyles={{
            table: "",
            rowStyles: "!important border-none",
          }}
          columnPinning={true}
        />
        <div className="mt-6 flex justify-between ">
          <div> The above table shows list of Entity configured in CAPS</div>
          <div className="mb-4"><Button onClick={() => router.push('/caps/add-entity')}>Add Entity</Button></div>
        </div>
      </div>
    )}
  </>
  )
}

EntityDashboard.noLayout = false;
export default EntityDashboard

type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

const entityDashboardColumns: ExtendedColumnDef<any>[] = [
  {
    accessorKey: "id",
    column_name: "entity_id",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[80px]">Entity ID</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className='!no-underline' title={row.original.id}>
          <Text className="max-w-[150px] truncate">
            {row?.original?.id}
          </Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "country",
    column_name: "country_code",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Country Code</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title={row?.original?.country}>
          <Text className="max-w-[80px] truncate">{row?.original?.country}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "name",
    column_name: "module",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Module</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title={row?.original?.module}>
          <Text className="max-w-[80px] truncate">{row?.original?.module}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "org",
    column_name: "organization_id",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]">Organization ID</TableHeader>;
    },
    cell: ({ row }) => {
      return (
        <abbr className="no-underline" title={row?.original?.org}>
          <Text className="max-w-[80px] truncate">{row?.original?.org}</Text>
        </abbr>
      );
    },
  },
  {
    accessorKey: "actions",
    column_name: "actions",
    enableHiding: false,
    header: () => {
      return <TableHeader className="min-w-[150px]"></TableHeader>;
    },

    cell: ({ row }) => {
      const supabase = supabaseClient('caps')

      const handleEdit = () => {
        router.push(`/caps/entity-configuration?id=${row?.original?.id}`)
      }

      function checkSuccess(message: string) {
        const regex = /deleted successfully/;
        return (message.match(regex) ? true : false);
      }

      const handleDelete = async (id: number) => {
        console.log('Button clicked');

        try {
          const { data, error } = await supabase
            .from('pg_entity')
            .delete()
            .eq('id', id);
          console.log('step : 1');
          const message = error ? JSON.stringify(error) : JSON.stringify(data);
          console.log('step : 2');
          if (error || !checkSuccess(message)) {
            alert("Delete Error :  Could not delete the payment gateway: " + message);
          }
          console.log('step : 3');
          console.log('Deleted data:', data);

        } catch (error) {
          console.error('Error deleting data:', error);
        }
      };

      return (
        <div className='flex px-2 space-x-4'>
          <FaEdit className=" h-4 w-4 text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => {
            handleEdit()
          }} />
          <FaTrash className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => {
            handleDelete(row?.original?.id);
          }} />
        </div>

      );

    },
  },

]

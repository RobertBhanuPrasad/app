import { useTable } from "@refinedev/core";
import { Payment, columns } from "./columns";
import { DataTable } from "./dataTable";
import React from "react";

export default function DemoPage() {
  // const { tableQueryResult } = useTable<Payment>({
  //   resource: "Course",
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //   },
  // });

  const { tableQueryResult } = useTable<any>({
    resource: "Course",
    meta: {
      select:
        "*, center(id, name), state(id, name), region(id, name), categoryMaster(id, category_name, category_value)",
    },
  });

  console.log("heyy result", tableQueryResult);

  // const data = tableQueryResult?.data?.data ?? [];

  return (
    <div className="container mx-auto py-10">
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
}

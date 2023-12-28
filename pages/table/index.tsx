import { useTable } from "@refinedev/core";
import { Payment, columns } from "./columns";
import { DataTable } from "./dataTable";
import React from "react";

export default function DemoPage() {
  const { tableQueryResult } = useTable<Payment>({
    resource: "payment",
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const data = tableQueryResult?.data?.data ?? [];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

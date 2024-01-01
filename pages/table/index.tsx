import { useTable } from "@refinedev/core";
import { Payment, columns } from "./columns";
import { DataTable } from "./dataTable";
import React, { useMemo } from "react";
import { Input } from "src/ui/input";

export default function DemoPage() {
  // const { tableQueryResult } = useTable<Payment>({
  //   resource: "Course",
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //   },
  // });

  const { tableQueryResult, setCurrent, filters, setFilters } = useTable<any>({
    resource: "course",
    meta: {
      select:
        "*, center(id, name), state(id, name), region(id, name) , category_master(id,category_value)",
    },
  });

  const data = tableQueryResult?.data?.data ?? [];

  const currentFilterValues = useMemo(() => {
    // Filters can be a LogicalFilter or a ConditionalFilter. ConditionalFilter not have field property. So we need to filter them.
    // We use flatMap for better type support.
    const logicalFilters = filters.flatMap((item) =>
      "field" in item ? item : []
    );

    return {
      email:
        logicalFilters.find((item) => item.field === "contact_email")?.value ||
        "",
    };
  }, [filters]);

  return (
    <div className="container mx-auto py-10">
      <Input
        placeholder="Filter emails..."
        value={currentFilterValues.email}
        onChange={(e) => {
          setFilters([
            {
              field: "contact_email",
              operator: "contains",
              value: !!e.currentTarget.value
                ? e.currentTarget.value
                : undefined,
            },
          ]);
        }}
        className="max-w-sm"
      />
      <DataTable columns={columns} data={data} setCurrent={setCurrent} />
    </div>
  );
}

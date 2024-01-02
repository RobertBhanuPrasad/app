import { useTable } from "@refinedev/core";
import { Payment, columns } from "./columns";
import { DataTable } from "./dataTable";
import React, { useMemo } from "react";
import { Input } from "src/ui/input";
import { Button } from "src/ui/button";
import { useRouter } from "next/router";

export default function CourseTable() {
  const {
    tableQueryResult,
    current,
    setCurrent,
    pageCount,
    filters,
    setFilters,
    setPageSize,
    pageSize,
  } = useTable<any>({
    resource: "course",
    meta: {
      select:
        "*, center(id, name), state(id, name), region(id, name) , category_master(id,category_value)",
    },
  });

  const data = tableQueryResult?.data?.data ?? [];

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) =>
      "field" in item ? item : []
    );

    return {
      email:
        logicalFilters.find((item) => item.field === "contact_email")?.value ||
        "",
    };
  }, [filters]);
  const { push } = useRouter();

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-row justify-between">
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
        <Button onClick={() => push("/course/create")}>New Course</Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        setCurrent={setCurrent}
        pageCount={pageCount}
        current={current}
        setPageSize={setPageSize}
        pageSize={pageSize}
      />
    </div>
  );
}

CourseTable.noLayout = true;

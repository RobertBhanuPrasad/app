import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../DataTable";
import { useEffect } from "react";
import {
  useFieldArray,
  useFormContext,
  useController,
  FieldValues,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "src/ui/checkbox";
import { Input } from "src/ui/input";
import Delete from "@public/assets/Delete";
import CustomSelect from "src/ui/custom-select";
import {  useSelect } from "@refinedev/core";

export default function CourseTable() {
  const { append, remove } = useFieldArray({
    name: "fees",
  });

  const feeData = useWatch({ name: "fees" });

  useEffect(() => {
    if (feeData.length <= 0) {
      append({
        accomodationFee: "",
        accomodationSpots: "",
        accomodationType: undefined,
      });
    }
  }, []);

  const handleAddRow = () => {
    append({
      accomodationFee: "",
      accomodationSpots: "",
      accomodationType: undefined,
    });
  };

  const handleDeleteRow = (index: number) => {
    remove(index);
  };

  return (
    <div>
      <DataTable
        tableStyles="w-[1100px]"
        columns={columns(handleAddRow, handleDeleteRow, feeData)}
        data={feeData || []}
      />
    </div>
  );
}

CourseTable.noLayout = false;

export const columns = (
  handleAddRow: () => void,
  handleDeleteRow: (index: number) => void,
  fields: any[]
): ColumnDef<FieldValues>[] => [
  {
    id: "fees",
    header: () => <div>Accommodation Type</div>,
    cell: ({ row }: any) => {
      const { field, fieldState } = useController({
        name: `fees.${row.index}.accomodationType`,
      });

      const { options, onSearch } = useSelect({
        resource: "accomdation_types",
        optionLabel: "name",
        optionValue: "id",

        onSearch: (value) => [
          {
            field: "name",
            operator: "contains",
            value,
          },
        ],
      });

      return (
        <CustomSelect
          error={fieldState.error}
          value={field.value}
          placeholder="Select Organization"
          data={options}
          onBottomReached={() => {}}
          onSearch={(val: string) => {
            onSearch(val);
          }}
          onChange={(val) => {
            field.onChange(val);
          }}
        />
      );
    },
  },

  {
    id: "fees",
    header: () => <div>Fees Per Person inc VAT</div>,
    cell: ({ row }: any) => {
      const { field } = useController({
        name: `fees.${row.index}.accomodationFee`,
      });

      return <Input {...field} />;
    },
  },
  {
    id: "fees",
    header: () => <div>Number of spots avaliable</div>,
    cell: ({ row }: any) => {
      const { field } = useController({
        name: `fees.${row.index}.accomodationSpots`,
      });

      return <Input {...field} />;
    },
  },
  {
    id: "Actions",
    header: () => <div>Actions</div>,
    cell: ({ row }: any) => {
      const isLastRow = row.index === fields.length - 1;
      const isFirstRow = row.index === 0;

      return (
        <div className="flex gap-4">
          {isLastRow && (
            <div onClick={handleAddRow} className="text-[#7677F4]">
              +Add
            </div>
          )}
          {!isFirstRow && (
            <div
              onClick={() => handleDeleteRow(row.index)}
              className="flex flex-row gap-1 justify-center items-center text-[#7677F4]"
            >
              <Delete />
              <div>Delete</div>
            </div>
          )}
        </div>
      );
    },
  },
];

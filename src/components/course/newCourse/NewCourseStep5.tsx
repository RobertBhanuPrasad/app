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
import { useSelect } from "@refinedev/core";
import Add from "@public/assets/Add";

export default function CourseTable() {
  // Hook to manage dynamically added fields in the form
  const { append } = useFieldArray({
    name: "fees",
  });

  // Hook to access form context
  const { getValues } = useFormContext();

  // Get form data
  const formData = getValues();

  // Effect to add initial data if no fees are present
  useEffect(() => {
    if (!formData?.fees || formData?.length <= 0) {
      append({
        accomodationFee: "",
        accomodationSpots: "",
        accomodationType: undefined,
      });
    }
  }, []);

  return (
    <div>
      {/* Render DataTable with form data */}
      <DataTable
        tableStyles="w-[1072px]"
        columns={columns}
        data={formData?.fees || []}
      />
    </div>
  );
}

// Setting a property on the CourseTable function to indicate it has a layout
CourseTable.noLayout = false;

// Definition of columns for the DataTable
export const columns: ColumnDef<any>[] = [
  {
    // Column for Accommodation Type
    id: "fees",
    header: () => <div>Accommodation Type</div>,
    cell: ({ row }: any) => {
      // Custom hook to control a field in the form
      const { field, fieldState } = useController({
        name: `fees.${row.index}.accomodationType`,
      });

      // Hook to fetch and manage options for a select input
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
        <div className="w-72 ">
          {/* Custom select input */}
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
        </div>
      );
    },
  },

  // Column for Fees Per Person including VAT
  {
    id: "fees",
    header: () => <div>Fees Per Person inc VAT</div>,
    cell: ({ row }: any) => {
      const {
        field: { value, onChange },
      } = useController({
        name: `fees.${row.index}.accomodationFee`,
      });

      return (
        <div className="w-72">
          {/* Input field for fees */}
          <Input
            value={value}
            onChange={(val) => {
              onChange(val?.target?.value);
            }}
          />
        </div>
      );
    },
  },
  // Column for Number of spots available
  {
    id: "fees",
    header: () => <div>Number of spots available</div>,
    cell: ({ row }: any) => {
      const {
        field: { value, onChange },
      } = useController({
        name: `fees.${row.index}.accomodationSpots`,
      });

      return (
        <div className="w-72">
          {/* Input field for number of spots available */}
          <Input
            value={value}
            onChange={(val) => {
              onChange(val?.target?.value);
            }}
          />
        </div>
      );
    },
  },
  // Column for Actions
  {
    id: "Actions",
    header: () => <div>Actions</div>,
    cell: ({ row }: any) => {
      const { getValues } = useFormContext();
      const { append, remove } = useFieldArray({
        name: "fees",
      });
      const formData = getValues();
      const isLastRow = row.index === formData?.fees?.length - 1;
      const isFirstRow = row.index === 0;

      // Function to add a new row
      const handleAddRow = () => {
        append({
          accomodationFee: "",
          accomodationSpots: "",
          accomodationType: undefined,
        });
      };

      // Function to delete a row
      const handleDeleteRow = (index: number) => {
        remove(index);
      };

      return (
        <div className="w-[150px] flex gap-4">
          {/* Button to add a new row */}
          {isLastRow && (
            <div
              onClick={handleAddRow}
              className="flex flex-row gap-1 justify-center items-center cursor-pointer text-[#7677F4]"
            >
              <Add />
              Add
            </div>
          )}
          {/* Button to delete a row */}
          {!isFirstRow && (
            <div
              onClick={() => handleDeleteRow(row.index)}
              className="flex flex-row gap-1 justify-center items-center text-[#7677F4] cursor-pointer"
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

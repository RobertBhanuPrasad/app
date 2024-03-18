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
import { CrudFilter, useSelect } from "@refinedev/core";
import Add from "@public/assets/Add";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import { RadioGroup } from "src/ui/radio-group";

export default function CourseTable() {
  // Hook to manage dynamically added fields in the form
  const { append } = useFieldArray({
    name: "accommodation",
  });

  // Hook to access form context
  const { getValues } = useFormContext();

  // Get form data
  const formData = getValues();

  // Effect to add initial data if no fees are present
  useEffect(() => {
    if (!formData?.accommodation || formData?.accommodation?.length <= 0) {
      append({
        accomodationFee: "",
        accomodationSpots: "",
        accomodationType: undefined,
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <ResidentialCourse />
      <DataTable
        tableStyles="w-[1072px]"
        columns={columns}
        data={formData?.accommodation || []}
      />
      <AccommodationFeeMode />
    </div>
  );
}

// Setting a property on the CourseTable function to indicate it has a layout
CourseTable.noLayout = false;

// Definition of columns for the DataTable
export const columns: ColumnDef<any>[] = [
  {
    // Column for Accommodation Type
    id: "accommodation",
    header: () => <div>Accommodation Type</div>,
    cell: ({ row }: any) => {
      const { watch } = useFormContext();

      const formData = watch("accommodation");

      const existingAccommodationValues = formData
        ?.map((field: any) => field?.accomodationType?.value)
        .filter((value: any) => value !== undefined);

      // Custom hook to control a field in the form
      const { field, fieldState } = useController({
        name: `accommodation.${row.index}.accomodationType`,
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
       const filteredOptions = options.filter(
         (option) => !existingAccommodationValues.includes(option.value)
       );


      return (
        <div className="w-72 ">
          {/* Custom select input */}
          <CustomSelect
            error={fieldState.error}
            value={field.value}
            placeholder="Select Organization"
            data={filteredOptions}
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
    id: "accommodation",
    header: () => <div>Fees Per Person inc VAT</div>,
    cell: ({ row }: any) => {
      const {
        field: { value, onChange },
      } = useController({
        name: `accommodation.${row.index}.accomodationFee`,
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
    id: "accommodation",
    header: () => <div>Number of spots available</div>,
    cell: ({ row }: any) => {
      const {
        field: { value, onChange },
      } = useController({
        name: `accommodation.${row.index}.accomodationSpots`,
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
        name: "accommodation",
      });
      const formData = getValues();
      const isLastRow = row.index === formData?.accommodation?.length - 1;
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

export const ResidentialCourse = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "isResidentialCourse",
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-sm font-normal text-[#333333]">
        Residential Course <span className="text-[#7677F4]">*</span>
      </div>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="Yes"
            selectedRadioValue={value}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="No"
            selectedRadioValue={value}
            label="No"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const AccommodationFeeMode = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: "accommodationPaymentMode",
  });
  return (
    <div className="flex gap-1 flex-col">
      <div className="text-sm font-normal text-[#333333]">
        Accommodation fee payment mode <span className="text-[#7677F4]">*</span>
      </div>
      <RadioGroup onValueChange={onChange} value={value}>
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="Pay Online"
            selectedRadioValue={value}
            label="Pay Online"
            className="w-[131px] h-[40px] rounded-[12px] "
          />
          <RadioButtonCard
            value="Pay Offline"
            selectedRadioValue={value}
            label="Pay Offline"
            className="w-[131px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

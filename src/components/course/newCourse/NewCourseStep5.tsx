import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../DataTable";
import React, { useEffect, useRef } from "react";
import {
  useFieldArray,
  useFormContext,
  useController,
  FieldValues,
  useWatch,
  useFormState,
} from "react-hook-form";
import { Checkbox } from "src/ui/checkbox";
import { Input } from "src/ui/input";
import Delete from "@public/assets/Delete";
import CustomSelect from "src/ui/custom-select";
import { useOne, useSelect } from "@refinedev/core";
import Add from "@public/assets/Add";
import { RadioButtonCard } from "src/ui/radioButtonCard";
import { RadioGroup } from "src/ui/radio-group";
import { NewCourseStep5FormNames } from "src/constants/CourseConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from "src/ui/select";
import _ from "lodash";

export default function CourseTable() {
  // const formData = useWatch({ name: "accommodation" });

  const { watch } = useFormContext();

  const formData = watch();

  return (
    <div className="flex flex-col gap-8 w-full">
      <ResidentialCourse />
      {formData?.is_residential_program == true && (
        <div>
          <AccomdationComponent />

          <AccommodationFeeMode />
        </div>
      )}
    </div>
  );
}

export const AccomdationComponent = () => {
  // Hook to manage dynamically added fields in the form
  const { append, remove, fields } = useFieldArray({
    name: "accommodation",
  });

  const { watch } = useFormContext();

  const formData = watch();

  // Effect to add initial data if no fees are present
  useEffect(() => {
    if (!formData?.accommodation || formData?.accommodation.length <= 0) {
      append(null);
    }
  }, []);

<<<<<<< Updated upstream
  return (
    <div className="flex flex-col gap-8">
      <ResidentialCourse />
      <DataTable
        tableStyles="w-[1072px]"
        columns={columns(append, remove, formData?.accommodation)}
        data={formData?.accommodation || []}
      />
      <AccommodationFeeMode />
    </div>
  );
}

// Setting a property on the CourseTable function to indicate it has a layout
CourseTable.noLayout = false;

// Definition of columns for the DataTable
const columns = (append: any, remove: any, formData: any) => [
  {
    // Column for Accommodation Type
    id: "accommodation",
    header: () => <div>Accommodation Type</div>,
    cell: ({ row }: any) => {

      const existingAccommodationValues = formData
        ?.map((field: any) => field?.accomodationType?.value)
        .filter((value: any) => value !== undefined);

      // Custom hook to control a field in the form
      const {
        field: { value, onChange },
        fieldState: { error },
      } = useController({
        name: `accommodation[${row.index}].accommodation_type_id`,
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
        (option) => !existingAccommodationValues?.includes(option.value)
      );

      return (
        <div className="w-72 ">
          {/* Custom select input */}

          <Select
            value={value}
            onValueChange={(value: any) => {
              onChange(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Accommodation" />
            </SelectTrigger>
            <SelectContent>
              <Input onChange={(val) => onSearch(val.target.value)} />
              <SelectItems onBottomReached={() => {}}>
                {filteredOptions?.map((option, index) => {
                  return (
                    <div>
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="h-[44px]"
                      >
                        {option.label}
                      </SelectItem>
                      {index < options?.length - 1 && (
                        <hr className="border-[#D6D7D8]" />
                      )}
                    </div>
                  );
                })}
              </SelectItems>
            </SelectContent>
          </Select>
          {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
        </div>
      );
    },
  },

  // Column for Fees Per Person including VAT
  {
    id: "accommodationFee",
    header: () => <div>Fees Per Person inc VAT</div>,
    cell: ({ row }: any) => {

      const {
        field: { value, onChange },
        fieldState:{error}
      } = useController({
        name: `accommodation[${row.index}].fee_per_person`,
      });

      return (
        <div className="w-72">
          {/* Input field for fees */}
          <Input
            value={value}
            onChange={(val) => {
              onChange(val?.target?.value);
            }}
            error={error ? true : false}
          />
          {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
        </div>
      );
    },
  },
  // Column for Number of spots available
  {
    id: "accommodationspots",
    header: () => <div>Number of spots available</div>,
    cell: ({ row }: any) => {

      const {
        field: { value, onChange },
        fieldState:{error}
      } = useController({
        name: `accommodation[${row.index}].no_of_residential_spots`,
      });

      return (
        <div className="w-72">
          {/* Input field for number of spots available */}
          <Input
            value={value}
            onChange={(val) => {
              onChange(val?.target?.value);
            }}
            error={error ? true : false}
          />
          {error && (
        <span className="text-[#FF6D6D] text-[12px] break-words">{error?.message}</span>
      )}
        </div>
      );
    },
  },
  // Column for Actions
  {
    id: "Actions",
    header: () => <div>Actions</div>,
    cell: ({ row }: any) => {
      const isLastRow = row.index === formData?.length - 1;
      const isFirstRow = row.index === 0;

      // Function to add a new row
      const handleAddRow = () => {
        append(null);
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
=======
  const accommodations = formData.accommodation || [];

  return (
    <div className="rounded-[12px]  border border-[#D6D7D8]">
      <div className="flex h-[48px]">
        <div className="p-4 bg-[#7677F41A] w-[288px] ">Accommodation Type</div>
        <div className="p-4 bg-[#7677F41A]  w-[288px]">
          Fee per person (MYR) Inc. VAT
        </div>
        <div className="p-4  bg-[#7677F41A]  w-[288px]">
          Number of spots available
        </div>
        <div className="p-4 w-24 w-[151px] bg-[#7677F41A] ">Actions</div>
      </div>

      <div className="my-[10px]">
        {fields.map((field: any, index: number) => (
          <div key={field.id} className="flex items-center w-full h-[48px] ">
            <div className=" w-[288px] p-[10px]">
              <AccommodationType index={index} />
            </div>
            <div className="p-4  w-[288px] p-[10px]">
              <FeePerPerson index={index} />
            </div>
            <div className="p-4  w-[288px] p-[10px]">
              <AccomdationSpot index={index} />
            </div>
            <div className=" w-[151px]  p-[10px] flex  ">
              <AccomdationAction
                index={index}
                remove={remove}
                append={append}
              />
            </div>

            {index < accommodations?.length - 1 && (
              <hr className="border-[#D6D7D8]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
>>>>>>> Stashed changes

export const ResidentialCourse = () => {
  const {
    field: { value, onChange },
  } = useController({
    name: NewCourseStep5FormNames?.is_residential_program,
  });

  const { watch } = useFormContext();

  const { program_type_id } = watch();

  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: program_type_id,
  });

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-sm font-normal text-[#333333]">
        Residential Course <span className="text-[#7677F4]">*</span>
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(value) => {
          value === "true" ? onChange(true) : onChange(false);
        }}
        // we have to do disable this field when the selected program_type_id has in_online_program to true
        disabled={programTypeData?.data?.in_online_program === true}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label="Yes"
            className="w-[112px] h-[40px] rounded-[12px]"
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
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
    name: NewCourseStep5FormNames?.accommodation_fee_payment_mode,
  });
  return (
    <div className="flex gap-1 flex-col mt-[32px]">
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

const FeePerPerson = ({ index }: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `accommodation[${index}].fee_per_person`,
  });

  return (
    <div className="w-full">
      {/* Input field for fees */}
      <Input
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
        }}
        error={error ? true : false}
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
    </div>
  );
};

export const AccommodationType = ({ index }: { index: number }) => {
  const { watch } = useFormContext();

  const formData = watch().accommodation || [];

  //Requirement: We dont need to display the same Accommodation Type in the next dropdowns
  // so fot that we are removing the same Accommodation Type from the next dropdown
  const existingAccommodationValues = formData
    ?.map((field: any) => field?.accommodation_type_id)
    .filter(
      (value: any, tempIndex: number) =>
        value !== undefined && index !== tempIndex
    );

  // Custom hook to control a field in the form
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `accommodation[${index}].accommodation_type_id`,
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
    (option) => !existingAccommodationValues?.includes(option.value)
  );

  return (
    <div className="w-full ">
      <Select
        value={value}
        onValueChange={(value: any) => {
          onChange(value);
        }}
      >
        <SelectTrigger error={error ? true : false}>
          <SelectValue placeholder="Select Accommodation" />
        </SelectTrigger>
        <SelectContent>
          <Input onChange={(val) => onSearch(val.target.value)} />
          <SelectItems onBottomReached={() => {}}>
            {filteredOptions?.map((option, index) => {
              return (
                <div>
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="h-[44px]"
                  >
                    {option.label}
                  </SelectItem>
                  {index < options?.length - 1 && (
                    <hr className="border-[#D6D7D8]" />
                  )}
                </div>
              );
            })}
          </SelectItems>
        </SelectContent>
      </Select>
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
    </div>
  );
};

export const AccomdationSpot = ({ index }: { index: number }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: `accommodation[${index}].no_of_residential_spots`,
  });

  return (
    <div className="w-full">
      {/* Input field for number of spots available */}
      <Input
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
        }}
        error={error ? true : false}
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px] break-words">
          {error?.message}
        </span>
      )}
    </div>
  );
};

const AccomdationAction = ({
  index,
  append,
  remove,
}: {
  index: number;
  append: any;
  remove: any;
}) => {
  const { watch } = useFormContext();
  const formData = watch().accommodation || [];
  const isLastRow = index === formData?.length - 1;
  const isFirstRow = index === 0;

  // Function to add a new row
  const handleAddRow = () => {
    append(undefined);
  };

  // Function to delete a row
  const handleDeleteRow = (index: number) => {
    remove(index);
  };
  return (
    <div className="w-[150px] flex gap-4 ">
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
          onClick={() => handleDeleteRow(index)}
          className="flex flex-row gap-1 justify-center items-center text-[#7677F4] cursor-pointer"
        >
          <Delete />
          <div>Delete</div>
        </div>
      )}
    </div>
  );
};

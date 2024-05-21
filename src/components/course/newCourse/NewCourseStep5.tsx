import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../DataTable";
import React, { useEffect, useRef, useState } from "react";
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
import { useList, useOne, useSelect } from "@refinedev/core";
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
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { PAYMENT_MODE } from "src/constants/OptionLabels";
import { PAY_OFFLINE, PAY_ONLINE } from "src/constants/OptionValueOrder";
import { useTranslation } from 'next-i18next';
import { translatedText } from "src/common/translations";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { IsEditCourse } from "./EditCourseUtil";
import { supabaseClient } from "src/utility";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "src/ui/dialog";
import { Button } from "src/ui/button";

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
  const {t} = useTranslation(['common', "course.new_course", "new_strings"])
  // Hook to manage dynamically added fields in the form
  const { append, remove, fields } = useFieldArray({
    name: "accommodation",
  });

  const { watch } = useFormContext();

  const formData = watch();

  // Effect to add initial data if no fees are present
  useEffect(() => {
    if (!formData?.accommodation || formData?.accommodation.length <= 0) {
      append(undefined);
    }
  }, []);

  const accommodations = formData.accommodation || [];

  return (
    <div className="rounded-[12px] overflow-x-scroll border border-[#D6D7D8]">
      <div className="flex h-[48px]">
        <div className="p-4 bg-[#7677F41A] min-w-[288px] w-full">{t("course.new_course:accommodation_tab.accommodation_type")}</div>
        <div className="p-4 bg-[#7677F41A] min-w-[288px] w-full">
          {t("new_strings:fee_per_person")} (MYR) {t("new_strings:inc_vat")}
        </div>
        <div className="p-4  bg-[#7677F41A] min-w-[288px] w-full">
        {t("course.new_course:accommodation_tab.number_of_spots")}
        </div>
        <div className="p-4 w-24 min-w-[200px] w-full bg-[#7677F41A] ">{t("actions")}</div>
      </div>

      <div className="my-[10px]">
        {fields.map((field: any, index: number) => (
          <AccommodationField
            key={field.id}
            data={field}
            index={index}
            remove={remove}
            append={append}
            accommodations={accommodations}
          />
        ))}
      </div>
    </div>
  );
};

export const AccommodationField = ({
  index,
  remove,
  append,
  accommodations,
  data,
}: {
  /**
   * index of the particular acommodation type
   */
  index: number;
  /**
   * use controller remove method to remove the particular row
   */
  remove: Function;
  /**
   * use controller append method to add the new row
   */
  append: Function;
  /**
   * This has all accommodations data
   */
  accommodations: ProgramAccommodationsDataBaseType[];
  /**
   * This contain the particular accommodation data
   */
  data: ProgramAccommodationsDataBaseType;
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center w-full h-auto">
      <div className="min-w-[288px] w-full p-[10px]">
        <AccommodationType index={index} />
      </div>
      <div className="p-4 min-w-[288px] w-full p-[10px]">
        <FeePerPerson index={index} />
      </div>
      <div className="p-4 min-w-[288px] w-full p-[10px]">
        <AccomdationSpot index={index} />
      </div>
      <div className="min-w-[130spx] w-full p-[10px] flex">
        <AccomdationAction index={index} remove={remove} append={append} />
      </div>

      {index < accommodations?.length - 1 && (
        <hr className="border-[#D6D7D8]" />
      )}
    </div>
  );
};

export const ResidentialCourse = () => {
  const {t} = useTranslation('common')
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
        {t("residential_course")} <span className="text-[#7677F4]">*</span>
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(value) => {
          value === "true" ? onChange(true) : onChange(false);
        }}
        // we have to do disable this field when the selected program_type_id has is_online_program to true
        disabled={programTypeData?.data?.is_online_program === true}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value="true"
            selectedRadioValue={JSON.stringify(value)}
            label={t("yes")}
            className="w-[112px] h-[40px] rounded-[12px]"            
          />
          <RadioButtonCard
            value="false"
            selectedRadioValue={JSON.stringify(value)}
            label={t("no_button")}
            className="w-[112px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export const AccommodationFeeMode = () => {
  const {t} = useTranslation("course.new_course")
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: NewCourseStep5FormNames?.accommodation_fee_payment_mode,
  });

  const payOnlineId = getOptionValueObjectByOptionOrder(
    PAYMENT_MODE,
    PAY_ONLINE
  )?.id;

  const payOfflineId = getOptionValueObjectByOptionOrder(
    PAYMENT_MODE,
    PAY_OFFLINE
  )?.id;

  return (
    <div className="flex gap-1 flex-col mt-[32px]">
      <div className="text-sm font-normal text-[#333333]">
        {t("course.new_course:accommodation_tab.accommodation_fee")} <span className="text-[#7677F4]">*</span>
      </div>
      <RadioGroup
        value={JSON.stringify(value)}
        onValueChange={(value) => {
          onChange(parseInt(value));
        }}
      >
        <div className="flex flex-row gap-6 ">
          <RadioButtonCard
            value={JSON.stringify(payOnlineId)}
            selectedRadioValue={JSON.stringify(value)}
            label={t("course.new_course:accommodation_tab.pay_online")}
            className="w-[131px] h-[40px] rounded-[12px] "
          />
          <RadioButtonCard
            value={JSON.stringify(payOfflineId)}
            selectedRadioValue={JSON.stringify(value)}
            label={t("course.new_course:accommodation_tab.pay_offline")}
            className="w-[131px] h-[40px] rounded-[12px]"
          />
        </div>
      </RadioGroup>
      {error && (
        <span className="text-[#FF6D6D] text-[14px]">{error?.message}</span>
      )}
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
    <div className='h-[40px] w-full'>
      {/* Input field for fees */}
      <Input
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
        }}
        error={error ? true : false}
      />
      <div>
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
      )}
      </div>
    </div>
  );
};

export const AccommodationType = ({
  index,
}: {
  /**
   * Index of the current accommodation
   */
  index: number;
}) => {

  const {t} = useTranslation("course.participants")

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

  const [isDisabled, setIsDisabled] = useState(false);

  const pathname = usePathname();

  const {
    query: { id },
  } = useRouter();

  useEffect(() => {
    // we need to execute this only wheb the url contains the edit course
    if (IsEditCourse(pathname) && value) {
      const fetchData = async () => {
        const { data, error }: any = await supabaseClient()
          .from("participant_registration")
          .select("id,program_accommodations!inner(*)")
          .eq("program_id", id)
          .eq("program_accommodations.accommodation_type_id", value)
          .limit(1);

        if (error) {
          console.error("some thing went wrong");
        } else {
          if (data && data?.length > 0) {
            setIsDisabled(true);
          }
        }
      };

      fetchData();
    }
  }, []);

  return (
    <div className='h-[40px] w-full'>
      <Select
        value={value}
        onValueChange={(value: any) => {
          onChange(value);
        }}
        disabled={isDisabled}
      >
        <SelectTrigger error={error ? true : false}>
          <SelectValue placeholder={t("course.participants:assisted_registration.accommodation_placeholder")} />
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
                    {translatedText(option.label)}
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
    <div className='h-[40px] w-full'>
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
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Function to add a new row
  const handleAddRow = () => {
    append(undefined);
  };

  // Function to delete a row
  const handleDelete= (index: number) => {
    remove(index);
  };
  const DeleteAccomodation = ({handleDeleteRow}:{handleDeleteRow: () => void}) => {
    const { t } = useTranslation(["common", "new_strings"]);
  
    return (
      <div>
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {t("delete_button")}
          </DialogTitle>
          <DialogDescription className="flex justify-center !pt-[14px] text-[16px] text-[#333333] whitespace-nowrap">
            {t("new_strings:are_you_sure_you_want_to_delete_this_accomodation")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full mt-[20px] flex !justify-center gap-6">
          <DialogClose>
            <Button className="border border-[#7677F4] bg-[white] w-[71px] h-[46px] text-[#7677F4] font-semibold">
              {t("no_button")}
            </Button>
          </DialogClose>
          <DialogClose>
            <Button
              className="bg-[#7677F4] w-[71px] h-[46px] rounded-[12px] font-semibold"
              onClick={handleDeleteRow}
            >
              {t("yes")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    );
  };
  
  const {t} = useTranslation('common')
  return (
    <div className="w-[150px] flex gap-4 ">
      {/* Button to add a new row */}
      {isLastRow && (
        <div
          onClick={handleAddRow}
          className="flex flex-row gap-1 justify-center items-center cursor-pointer text-[#7677F4]"
        >
          <Add />
          {t("add_button")}
        </div>
      )}
      {/* Button to delete a row */}
      {!isFirstRow && (
        <div className="flex flex-row gap-1 justify-center items-center text-[#7677F4] cursor-pointer">
          <div className="flex flex-row items-center gap-1" onClick={() => setDeleteDialogOpen(true)}>
            <Delete />
            <div>{t("delete_button")}</div>
          </div>
          {isDeleteDialogOpen && (
            <Dialog open={isDeleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(false)}>
              <DialogContent className="w-[450px] h-[189px] !py-6 !px-6 !rounded-[24px]">
                <DeleteAccomodation
                  handleDeleteRow={() => {
                    handleDelete(index);
                    setDeleteDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

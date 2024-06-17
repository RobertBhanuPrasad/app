import { useOne } from "@refinedev/core";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { NewCourseStep5FormNames } from "src/constants/CourseConstants";
import { Checkbox } from "src/ui/checkbox";
import { RadioGroup } from "src/ui/radio-group";
import { RadioButtonCard } from "src/ui/radioButtonCard";

export const NewEventStep4 = () => {
  const { watch } = useFormContext();
  const formData = watch();
  return (
    <>
      <div className="flex flex-col space-y-8">
        <PaidEvent />
        <div className="flex space-x-8">
          <FeeComponent />
        </div>
      </div>
    </>
  );
};
export const PaidEvent = () => {
  const { t } = useTranslation("common");
  const {
    field: { value: isResidential, onChange: onResidentialChange },
  } = useController({ name: NewCourseStep5FormNames?.is_residential_program });
  const {
    field: { value: disablePayLater, onChange: onDisablePayLaterChange },
  } = useController({ name: "need to add" });

  const { watch } = useFormContext();
  const { program_type_id } = watch();
  const { data: programTypeData } = useOne({
    resource: "program_types",
    id: program_type_id,
  });

  return (
    <>
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">
          Paid Event
          <span className="text-[#7677F4]">*</span>
        </div>
        <RadioGroup
          value={JSON.stringify(isResidential)}
          onValueChange={(value) => {
            value === "true"
              ? onResidentialChange(true)
              : onResidentialChange(false);
          }}
          disabled={programTypeData?.data?.is_online_program === true}
        >
          <div className="flex flex-row gap-6">
            <RadioButtonCard
              value="true"
              selectedRadioValue={JSON.stringify(isResidential)}
              label="Yes"
              className="w-[112px] h-[40px] rounded-[12px]"
            />
            <RadioButtonCard
              value="false"
              selectedRadioValue={JSON.stringify(isResidential)}
              label="No"
              className="w-[112px] h-[40px] rounded-[12px]"
            />
          </div>
        </RadioGroup>
      </div>
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">
          Disable Pay Later
          <span className="text-[#7677F4]">*</span>
        </div>
        <RadioGroup
          value={JSON.stringify(disablePayLater)}
          onValueChange={(value) => {
            value === "true"
              ? onDisablePayLaterChange(true)
              : onDisablePayLaterChange(false);
          }}
          disabled={programTypeData?.data?.is_online_program === true}
        >
          <div className="flex flex-row gap-6">
            <RadioButtonCard
              value="true"
              selectedRadioValue={JSON.stringify(disablePayLater)}
              label="Yes"
              className="w-[112px] h-[40px] rounded-[12px]"
            />
            <RadioButtonCard
              value="false"
              selectedRadioValue={JSON.stringify(disablePayLater)}
              label="No"
              className="w-[112px] h-[40px] rounded-[12px]"
            />
          </div>
        </RadioGroup>
      </div>
      <div className="flex justify-between items-center gap-[8px] py-7">
        <Checkbox
          onCheckedChange={() => {
            console.log("okay");
          }}
          className="w-6 h-6 border-[1px] border-[#D0D5DD] rounded-lg"
        />
        <div className="font-normal">Enable Early Bird Fee ?</div>
      </div>
    </>
  );
};

export const FeeComponent = () => {
  const { t } = useTranslation(["common", "course.new_course", "new_strings"]);
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
    <div className="flex flex-col space-y-8">
      <div className="rounded-[12px] overflow-x-scroll border border-[#D6D7D8]">
        <div className="flex h-[48px]">
          <div className="p-4 bg-[#7677F41A] min-w-[288px] w-full">
            {/* {t("course.new_course:accommodation_tab.accommodation_type")} */}
            Fee level
          </div>
          <div className="p-4 bg-[#7677F41A] min-w-[288px] w-full">
            {/* {t("new_strings:fee_per_person")} (MYR) {t("new_strings:inc_vat")} */}
            Fee Level Description
          </div>
          <div className="p-4  bg-[#7677F41A] min-w-[288px] w-full">
            {/* {t("course.new_course:accommodation_tab.number_of_spots")} */}
            Normal Fees Per Person (EUR)
          </div>
          <div className="p-4  bg-[#7677F41A] min-w-[288px] w-full">
            {/* {t("course.new_course:accommodation_tab.number_of_spots")} */}
            VAT (EUR)
          </div>
          <div className="p-4  bg-[#7677F41A] min-w-[288px] w-full">
            {/* {t("course.new_course:accommodation_tab.number_of_spots")} */}
            Total Fee
          </div>
          <div className="p-4  bg-[#7677F41A] min-w-[288px] w-full">
            {/* {t("course.new_course:accommodation_tab.number_of_spots")} */}
            Early Bird Fee
          </div>
          <div className="p-4 w-24 min-w-[200px] w-full bg-[#7677F41A] ">
            {/* {t("actions")} */}
            Actions
          </div>
        </div>

        <div className="my-[10px]">
          {/* {fields.map((field: any, index: number) => (
          <AccommodationField
            key={field.id}
            data={field}
            index={index}
            remove={remove}
            append={append}
            accommodations={accommodations}
          />
        ))} */}
        </div>
      </div>
    </div>
  );
};

// export const AccommodationField = () =>{};

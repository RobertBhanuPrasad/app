import Coteacher from "@public/assets/Coteacher";
import Organizer from "@public/assets/Organizer";
import Teacher from "@public/assets/Teacher";
import { useSelect } from "@refinedev/core";
import React, { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Card } from "src/ui/card";
import CustomSelect from "src/ui/custom-select";
import { Label } from "src/ui/label";
import { MultiSelect } from "src/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "src/ui/radio-group";
import { Switch } from "src/ui/switch";

function NewCourseStep1() {
  const [selectedRadioValue, setRadioSelectedValue] = useState("option-one");

  return (
    <div>
      <RadioGroup
        defaultValue="option-one"
        onValueChange={(selectedRadioValue: string) => {
          console.log(selectedRadioValue, "selectedRadioValue");
          setRadioSelectedValue(selectedRadioValue);
        }}
      >
        <div className="flex items-center flex-row gap-7">
          <Card
            className={` p-2 w-80 h-[106px] flex flex-row ${
              selectedRadioValue === "option-one"
                ? "border-[#7677F4] shadow-md shadow-[#7677F450]  "
                : ""
            }`}
          >
            <div>
              <RadioGroupItem
                value="option-one"
                id="option-one"
                className={
                  selectedRadioValue === "option-one"
                    ? "!bg-[#7677F4]"
                    : "border !border-[#D6D7D8] border-[1.5px]"
                }
              />
            </div>
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Teacher
                color={` ${
                  selectedRadioValue === "option-one" ? "#7677F4" : "#999999"
                }`}
              />
              <Label
                htmlFor="option-one"
                className={`text-[#999999] font-normal ${
                  selectedRadioValue === "option-one" ? "text-[#7677F4]" : ""
                }`}
              >
                I am teaching this course
              </Label>
            </div>
          </Card>

          <Card
            className={` p-2 gap-2 w-80 h-[106px] flex flex-row ${
              selectedRadioValue === "option-two"
                ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
                : ""
            }`}
          >
            <RadioGroupItem
              value="option-two"
              id="option-two"
              className={
                selectedRadioValue === "option-two"
                  ? "!bg-[#7677F4]"
                  : "border !border-[#D6D7D8] border-[1.5px]"
              }
            />
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Coteacher
                color={` ${
                  selectedRadioValue === "option-two" ? "#7677F4" : "#999999"
                }`}
              />
              <Label
                htmlFor="option-two"
                className={`text-[#999999] font-normal ${
                  selectedRadioValue === "option-two" ? "text-[#7677F4]" : ""
                }`}
              >
                I am co-teaching this course
              </Label>
            </div>
          </Card>

          <Card
            className={`flex justify-center p-2 gap-2 w-80 h-[106px] flex flex-row ${
              selectedRadioValue === "option-three"
                ? "border-[#7677F4] shadow-md shadow-[#7677F450] "
                : ""
            }`}
          >
            <RadioGroupItem
              value="option-three"
              id="option-three"
              className={
                selectedRadioValue === "option-three"
                  ? "!bg-[#7677F4]"
                  : "border !border-[#D6D7D8] border-[1.5px]"
              }
            />
            <div className="flex flex-col items-center gap-[16px]  w-full justify-center">
              <Organizer
                color={` ${
                  selectedRadioValue === "option-three" ? "#7677F4" : "#999999"
                }`}
              />
              <Label
                htmlFor="option-three"
                className={`text-[#999999] font-normal ${
                  selectedRadioValue === "option-three" ? "text-[#7677F4]" : ""
                }`}
              >
                I am organizing this course for another teacher
              </Label>
            </div>
          </Card>
        </div>
      </RadioGroup>
      <div className="mt-8 flex flex-row gap-7 ">
        <div className="flex gap-1 flex-col">
          <CourseTypeDropDown />
        </div>
        <div className="flex gap-1 flex-col">
          <ProgramOrganizerDropDown />
        </div>
      </div>
      <div className="flex flex-row gap-6 mt-[60px]">
        <div className="text-[14px] font-normal">
          Registration via 3rd party gateway
        </div>
        <Switch
          id="registration"
          className="!w-[57px] !h-[24px]"
          onCheckedChange={(value: any) => {
            console.log(value, "value");
          }}
        />
      </div>
    </div>
  );
}

export default NewCourseStep1;

const CourseTypeDropDown = () => {
  const { options, onSearch } = useSelect({
    resource: "organizations",
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
  const { getValues, register, control } = useForm();
  const {
    field: { value, onChange },
  } = useController({
    name: "organization",
    control,
  });
  const formData = getValues();
  console.log(formData, "formData");
  return (
    <div className="w-80">
      <div className="flex gap-1 flex-col">
        <div className="text-xs font-normal text-[#333333]">Organization *</div>

        <CustomSelect
          value={value}
          {...register("organization")}
          placeholder="Select Organization"
          data={options}
          onBottomReached={() => {}}
          onSearch={(val: string) => {
            onSearch(val);
          }}
          onChange={(val) => {
            console.log(val, "Value is multi select");
            onChange(val);
          }}
        />
      </div>
    </div>
  );
};

const ProgramOrganizerDropDown = () => {
  const [teachers, setTeachers] = useState();

  const { getValues, register, control, setValue, resetField } = useForm();
  const {
    field: { value, onChange },
  } = useController({
    name: "programOrganizerId",
    control,
  });

  const { options, onSearch } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "full_name",
        operator: "contains",
        value,
      },
    ],
  });

  // Function to handle changes in MultiSelect component
  const handleChange = (options: any) => {
    resetField("multi");
    //setting the value to formdata
    setValue("multi", options);
  };
  const formData = getValues();
  console.log(formData, "formData");

  console.log(options, "organizer");

  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-normal text-[#333333]">
        Program Organizer *
      </div>
      <MultiSelect
        value={value}
        placeholder="Enter Program organizer Name"
        data={options}
        onBottomReached={() => {}}
        onSearch={(val: string) => {
          onSearch(val);
        }}
        onChange={(val: any) => {
          console.log(val, "Value is program organizer");
          onChange(val.value);
        }}
      />
    </div>
  );
};

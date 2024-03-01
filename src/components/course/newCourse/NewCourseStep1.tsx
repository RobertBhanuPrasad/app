import Coteacher from "@public/assets/Coteacher";
import Organizer from "@public/assets/Organizer";
import Teacher from "@public/assets/Teacher";
import { useSelect } from "@refinedev/core";
import React, { useState } from "react";
import { Card } from "src/ui/card";
import CustomSelect from "src/ui/custom-select";
import { Label } from "src/ui/label";
import { MultiSelect } from "src/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "src/ui/radio-group";

function NewCourseStep1() {
  const [selectedRadioValue, setRadioSelectedValue] = useState("option-one");

  const [organization, setOrganization] = useState();

  const [teachers, setTeachers] = useState();

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

  const data = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
    { label: "C", value: "c" },
    { label: "D", value: "d" },
  ];

  console.log(options, "options");

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
                className={`text-[#333333] font-normal ${
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
                className={`text-[#333333] font-normal ${
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
                className={`text-[#333333] font-normal ${
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
          <div className="text-xs font-normal text-[#333333]">
            Organization *
          </div>
          <CustomSelect
            value={organization}
            placeholder="Select Organization"
            data={options}
            onBottomReached={() => {}}
            onSearch={(val: string) => {
              onSearch(val);
            }}
            onChange={(val) => {
              console.log(val, "Value is multi select");
            }}
          />
        </div>
        <div className="flex gap-1 flex-col">
          <div className="text-xs font-normal text-[#333333]">Program Organizer *</div>
          <MultiSelect
            value={teachers}
            placeholder="Enter Program Name"
            data={data}
            onBottomReached={() => {}}
            onSearch={() => {}}
            onChange={() => {}}
          />
        </div>
      </div>
      <div>
      Registration via 3rd party gateway
      </div>
    </div>
  );
}

export default NewCourseStep1;

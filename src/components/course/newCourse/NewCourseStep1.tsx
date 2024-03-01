import React, { useState } from "react";
import { Card } from "src/ui/card";
import { Label } from "src/ui/label";
import { RadioGroup, RadioGroupItem } from "src/ui/radio-group";

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
            className={`flex justify-center p-2 gap-2 w-80 h-[106px] ${
              selectedRadioValue === "option-one" ? "border-[#7677F4]" : ""
            }`}
          >
            <RadioGroupItem
              value="option-one"
              id="option-one"
              className={
                selectedRadioValue === "option-one"
                  ? "!bg-[#7677F4]"
                  : "border !border-[#D6D7D8] border-[1.5px]"
              }
            />
            <Label
              htmlFor="option-one"
              className={`text-[#333333] font-normal ${
                selectedRadioValue === "option-one" ? "text-[#7677F4]" : ""
              }`}
            >
              I am teaching this course
            </Label>
          </Card>
          {/* </div> */}
          {/* <div className="flex items-center space-x-2"> */}
          <Card
            className={`flex justify-center p-2 gap-2 w-80 h-[106px]  ${
              selectedRadioValue === "option-two" ? "border-[#7677F4]" : ""
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
            <Label
              htmlFor="option-two"
              className={`text-[#333333] font-normal ${
                selectedRadioValue === "option-two" ? "text-[#7677F4]" : ""
              }`}
            >
              I am co-teaching this course
            </Label>
          </Card>
          {/* </div> */}
          {/* <div className="flex items-center space-x-2"> */}
          <Card
            className={`flex justify-center p-2 gap-2 w-80 h-[106px] ${
              selectedRadioValue === "option-three" ? "border-[#7677F4]" : ""
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
            <Label
              htmlFor="option-three"
              className={`text-[#333333] font-normal ${
                selectedRadioValue === "option-three" ? "text-[#7677F4]" : ""
              }`}
            >
              I am organizing this course for another teacher
            </Label>
          </Card>
        </div>
      </RadioGroup>
    </div>
  );
}

export default NewCourseStep1;

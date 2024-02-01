import { useState } from "react";
import { Card,  } from "src/ui/card";
import { Label } from "src/ui/label";
import { RadioGroup, RadioGroupItem } from "src/ui/radio-group";

export default function Index() {
  const [selectedValue, setSelectedValue] = useState("option-one");

  return (
    <div className="text-3xl">

      <RadioGroup
        defaultValue="option-one"
        onValueChange={(value: string) => {
          setSelectedValue(value);
        }}
      >
        <div className="flex items-center space-x-2">
          <Card
            className={`flex justify-center p-2 gap-2 ${
              selectedValue === "option-one" ? "border-[#7677F4]" : ""
            }`}
          >
            <RadioGroupItem
              value="option-one"
              id="option-one"
              className={
                selectedValue === "option-one" ? "!bg-[#7677F4]" : "border !border-[#D6D7D8] border-[1.5px]"
              }
            />
            <Label
              htmlFor="option-one"
              className={`text-[#333333] font-normal ${
                selectedValue === "option-one" ? "text-[#7677F4]" : ""
              }`}
            >
              Option One
            </Label>
          </Card>
        </div>
        <div className="flex items-center space-x-2">
          <Card
            className={`flex justify-center p-2 gap-2 ${
              selectedValue === "option-two" ? "border-[#7677F4]" : ""
            }`}
          >
            <RadioGroupItem
              value="option-two"
              id="option-two"
              className={
                selectedValue === "option-two" ? "!bg-[#7677F4]" : "border !border-[#D6D7D8] border-[1.5px]"
              }
            />
            <Label
              htmlFor="option-two"
              className={`text-[#333333] font-normal ${
                selectedValue === "option-two" ? "text-[#7677F4]" : ""
              }`}
            >
              Option Two
            </Label>
          </Card>
        </div>
      </RadioGroup>
    </div>
  );
}

Index.noLayout = true;

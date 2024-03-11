import Add from "@public/assets/Add";
import Delete from "@public/assets/Delete";
import React from "react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "src/ui/input";
import { Textarea } from "src/ui/textarea";

function NewCourseStep6() {
  const { append, fields, remove } = useFieldArray({
    name: "contact",
  });

  const { getValues } = useFormContext();

  useEffect(() => {
    if (fields.length === 0) {
      append({ contactName: "", contactEmail: "", contactMobile: "" });
    }
  }, []);

  const handleAddItem = () => {
    append({ label: "" });
  };
  const handleDeleteItem = (index: number) => {
    remove(index);
  };

  return (
    <div className="p-2">
      {fields.map((contact, index) => (
        <div key={contact.id} className="flex gap-6">
          <div className="w-80 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? "Contact Name" : `Contact Name ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <Input
              placeholder="Enter contact name"
              name={`contact[${index}].contactName`}
            />
          </div>
          <div className="w-58 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? "Contact Email" : `Contact Email ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <Input
              placeholder="Enter contact email"
              name={`contact[${index}].contactEmail`}
            />
          </div>
          <div className="w-58 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? "Contact Number" : `Contact Number ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <Input
              placeholder="Enter contact email"
              name={`contact[${index}].contactMobile`}
            />
          </div>
          <div className="w-58 h-20 flex flex-row justify-center items-center gap-4">
            {index === 0 && fields.length - 1 == index && (
              <div
                onClick={handleAddItem}
                className="text-[#7677F4] flex flex-row gap-1 justify-center items-center cursor-pointer"
              >
                <Add />
                Add
              </div>
            )}
            {index !== 0 && (
              <div
                onClick={() => handleDeleteItem(index)}
                className="text-[#7677F4]  flex flex-row gap-1 justify-center items-center cursor-pointer"
              >
                <Delete />
                Delete
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="w-80 h-24 flex gap-1 flex-col ">
        <div className="flex flex-row text-xs font-normal text-[#333333]">
          Send BCC registration confirmation email to{" "}
          <div className="text-[#7677F4]"> *</div>
        </div>
        <Textarea placeholder="Enter course emails" className="!w-58" />
        <div className="flex flex-row gap-1 text-[#666666] text-[12px] italic">
          <span className="font-semibold">Note:</span>{" "}
          <div className="font-[400]">
            Enter comma separated list of email addresses.
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCourseStep6;

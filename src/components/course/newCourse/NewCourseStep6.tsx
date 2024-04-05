import Add from "@public/assets/Add";
import Delete from "@public/assets/Delete";
import React from "react";
import { useEffect } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { NewCourseStep6FormNames } from "src/constants/CourseConstants";
import { Input } from "src/ui/input";
import { Textarea } from "src/ui/textarea";

function NewCourseStep6() {
  // Destructuring the necessary functions from react-hook-form
  const { append, fields, remove } = useFieldArray({
    name: "contact",
  });
  const { getValues } = useFormContext();

  const {
    field: { value: courseEmails, onChange: courseEmailOnChange },
  } = useController({
    name: NewCourseStep6FormNames?.bcc_registration_confirmation_email,
  });

  const formData = getValues();

  console.log("heyy formData", formData);

  // useEffect to add an initial contact field if none exists
  useEffect(() => {
    if (fields.length === 0) {
      append({ contact_name: "", contact_email: "", contact_number: "" });
    }
  }, []);

  // Function to handle adding a new contact item
  const handleAddItem = () => {
    append({ contact_name: "", contact_email: "", contact_number: "" });
  };

  // Function to handle deleting a contact item based on index
  const handleDeleteItem = (index: number) => {
    remove(index);
  };

  return (
    <div className="p-2">
      {/* Mapping through each contact field */}
      {fields.map((contact, index) => (
        <div key={contact.id} className="flex gap-6">
          {/* Input field for Contact Name */}
          <div className="w-80 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? "Contact Name" : `Contact Name ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <ContactName index={index} />
          </div>

          {/* Input field for Contact Email */}
          <div className="w-58 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? "Contact Email" : `Contact Email ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <ContactEmail index={index} />
          </div>

          {/* Input field for Contact Number */}
          <div className="w-58 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? "Contact Number" : `Contact Number ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <ContactMobile index={index} />
          </div>

          {/* Add/Delete buttons for each contact item */}
          <div className="w-58 h-20 flex flex-row justify-center items-center gap-4">
            {/* For first row we need to show add and after adding additional rows then it should also disappear */}
            {index === 0 && fields.length - 1 == index && (
              <div
                onClick={handleAddItem}
                className="text-[#7677F4] flex flex-row gap-1 justify-center items-center cursor-pointer"
              >
                <Add />
                Add
              </div>
            )}
            {/* Except for first row we need to show delete icon */}
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

      {/* Additional section for BCC registration confirmation email */}
      <div className="w-80 h-24 flex gap-1 flex-col ">
        <div className="flex flex-row text-xs font-normal text-[#333333]">
          Send BCC registration confirmation email to{" "}
          <div className="text-[#7677F4]"> *</div>
        </div>
        <Textarea
          value={courseEmails}
          onChange={(val) => {
            courseEmailOnChange(val?.target?.value);
          }}
          placeholder="Enter course emails"
          className="!w-58"
        />
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

export const ContactName = ({ index }: any) => {
  const {
    field: { value, onChange },
  } = useController({ name: `contact[${index}].contact_name` });
  return (
    <Input
      placeholder="Enter contact name"
      value={value}
      onChange={(val) => {
        onChange(val?.target?.value);
      }}
    />
  );
};
export const ContactEmail = ({ index }: any) => {
  const {
    field: { value, onChange },
  } = useController({ name: `contact[${index}].contact_email` });
  return (
    <Input
      placeholder="Enter contact email"
      value={value}
      onChange={(val) => {
        onChange(val?.target?.value);
      }}
    />
  );
};

export const ContactMobile = ({ index }: any) => {
  const {
    field: { value, onChange },
  } = useController({ name: `contact[${index}].contact_number` });
  return (
    <Input
      placeholder="Enter contact mobile"
      value={value}
      onChange={(val) => {
        onChange(val?.target?.value);
      }}
    />
  );
};

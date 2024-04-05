import Add from "@public/assets/Add";
import Delete from "@public/assets/Delete";
import React from "react";
import { useEffect } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
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
    fieldState:{error:emailErrors}
  } = useController({ name: "contactCourseEmails" });

  const formData = getValues();

  console.log("heyy formData", formData);

  // useEffect to add an initial contact field if none exists
  useEffect(() => {
    if (fields.length === 0) {
      append(null);
    }
  }, []);

  // Function to handle adding a new contact item
  const handleAddItem = () => {
    append(null);
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
          error={emailErrors ? true : false}
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
    fieldState:{error}
  } = useController({ name: `contact[${index}].contactName` });
  return (
    <div>

    <Input
      placeholder="Enter contact name"
      value={value}
      onChange={(val) => {
        onChange(val?.target?.value);
      }}
      error={error ? true : false}
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">
          {error?.message}
          </span>
      )}
      </div>
    
  );
};
export const ContactEmail = ({ index }: any) => {
  const {
    field: { value, onChange },
    fieldState:{error}
  } = useController({ name: `contact[${index}].contactEmail` });
  
  return (
    <div>

    <Input
      placeholder="Enter contact email"
      value={value}
      onChange={(val) => {
        onChange(val?.target?.value);
      }}
      error={error ? true : false}
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">
           {error?.message}

          </span>
      )}
      </div>
  );
};

export const ContactMobile = ({ index }: any) => {
  const {
    field: { value, onChange },
    fieldState:{error}
  } = useController({ name: `contact[${index}].contactMobile` });
  return (
    <div>

    <Input
      placeholder="Enter contact mobile"
      value={value}
      onChange={(val) => {
        onChange(val?.target?.value);
      }}
      error={error ? true : false}
      />
      {error && (
        <span className="text-[#FF6D6D] text-[12px]">
          {error?.message}
          </span>
      )}
      </div>
  );
};

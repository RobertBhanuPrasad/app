import Add from "@public/assets/Add";
import Delete from "@public/assets/Delete";
import React from "react";
import { useEffect } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { NewCourseStep6FormNames } from "src/constants/CourseConstants";
import { Input } from "src/ui/input";
import { Textarea } from "src/ui/textarea";
import { useTranslation } from 'next-i18next';
import { Text } from "src/ui/TextTags";

function NewCourseStep6() {
  const {t} = useTranslation(['common', "course.new_course", "new_strings"])
  // Destructuring the necessary functions from react-hook-form
  const { append, fields, remove } = useFieldArray({
    name: NewCourseStep6FormNames.contact,
  });
  const { getValues } = useFormContext();

  const {
    field: { value: courseEmails, onChange: courseEmailOnChange },
    fieldState: { error },
  } = useController({
    name: NewCourseStep6FormNames?.bcc_registration_confirmation_email,
  });

  const formData = getValues();

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
    <div className="p-2 w-[1016px]">
      {/* Mapping through each contact field */}
      {fields.map((contact, index) => (
        <div key={contact.id} className="flex gap-6">
          {/* Input field for Contact Name */}
          <div className="w-80 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? t("contact_name") : `${t("contact_name")} ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <ContactName index={index} />
          </div>

          {/* Input field for Contact Email */}
          <div className="w-58 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? t("contact_email") : `${t("contact_email")} ${index + 1}`}{" "}
              <div className="text-[#7677F4]"> *</div>
            </div>
            <ContactEmail index={index} />
          </div>

          {/* Input field for Contact Number */}
          <div className="w-58 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? t("course.new_course:contact_info_tab.contact_number") : `${t("course.new_course:contact_info_tab.contact_number")} ${index + 1}`}{" "}
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
                {t("add")}
              </div>
            )}
            {/* Except for first row we need to show delete icon */}
            {index !== 0 && (
              <div
                onClick={() => handleDeleteItem(index)}
                className="text-[#7677F4]  flex flex-row gap-1 justify-center items-center cursor-pointer"
              >
                <Delete />
                {t("delete_button")}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Additional section for BCC registration confirmation email */}
      <div className="w-80 h-24 flex gap-1 flex-col ">
        <div className="flex flex-row text-xs font-normal text-[#333333]">
        {t("course.new_course:contact_info_tab.send_bcc")}{" "}
          <div className="text-[#7677F4]"> *</div>
        </div>
        <Textarea
          value={courseEmails}
          onChange={(val) => {
            courseEmailOnChange(val?.target?.value);
          }}
          placeholder={t("course.new_course:contact_info_tab.select_course")}
          className="!w-58"
          error={error ? true : false} // TODO need to change after integrating the form names
        />
        {error && (
          <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
        )}
        <div className="flex flex-row gap-1 text-[#666666] text-[12px] italic">
          <span className="font-semibold">{t("new_strings:note")}</span>{" "}
          <div className="font-[400]">
          {t("new_strings:enter_comma")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCourseStep6;

export const ContactName = ({ index }: any) => {
  const {t} = useTranslation("course.new_course")
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: `contact[${index}].contact_name` });
  return (
    <div>
      <Input
        placeholder={t("course.new_course:contact_info_tab.select_contact")}
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
export const ContactEmail = ({ index }: any) => {
  const {t} = useTranslation("course.new_course")
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: `contact[${index}].contact_email` });

  return (
    <div>
      <Input
        placeholder={t("course.new_course:contact_info_tab.select_contact_email")}
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

export const ContactMobile = ({ index }: any) => {
  const {t} = useTranslation("course.new_course")
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: `contact[${index}].contact_number` });
  return (
    <div>
      <Input
        placeholder={t(
          "course.new_course:contact_info_tab.select_contact_number"
        )}
        className="w-58"
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
        }}
        error={error ? true : false}
      />
      <Text>
        {error && (
          <span className="text-[#FF6D6D] text-[12px]">{error?.message}</span>
        )}
      </Text>
    </div>
  );
};

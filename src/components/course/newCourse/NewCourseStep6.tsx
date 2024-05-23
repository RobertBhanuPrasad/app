import Add from "@public/assets/Add";
import Delete from "@public/assets/Delete";
import React, { useState } from "react";
import { useTranslation } from 'next-i18next';
import { useEffect } from "react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { NewCourseStep6FormNames } from "src/constants/CourseConstants";
import { Text } from "src/ui/TextTags";
import { Button } from 'src/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'src/ui/dialog'
import { Input } from "src/ui/input";
import { Textarea } from "src/ui/textarea";

function NewCourseStep6() {
  const {t} = useTranslation(['common', "course.new_course", "new_strings"])
  // Destructuring the necessary functions from react-hook-form
  const { append, fields, remove } = useFieldArray({
    name: NewCourseStep6FormNames.contact,
  });
  const { getValues } = useFormContext();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      append({});
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
            </div>
            <ContactName index={index} />
          </div>

          {/* Input field for Contact Email */}
          <div className="w-70 h-20 ">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
              {index === 0 ? t("contact_email") : `${t("contact_email")} ${index + 1}`}{" "}
              <Text className="text-[#7677F4]"> *</Text>
            </div>
            <ContactEmail index={index} />
          </div>

          {/* Input field for Contact Number */}
          <div className="w-58 h-20 flex gap-1 flex-col">
            <div className="flex flex-row text-xs font-normal text-[#333333] gap-1">
            {index === 0 ? t("course.new_course:contact_info_tab.contact_number") : `${t("course.new_course:contact_info_tab.contact_number")} ${index + 1}`}{" "}
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
                {t("add_button")}
              </div>
            )}
            {/* Except for first row we need to show delete icon */}
            {index !== 0 && (
           <Dialog open={isDeleteDialogOpen} onOpenChange={ setDeleteDialogOpen}>
             <DialogTrigger
             onClick={() => {
              setDeleteDialogOpen(true)
             }}
             className="text-[#7677F4] font-normal cursor-pointer flex items-center gap-[6px]"
             >
             <Delete />
             {t('delete_button')}
             </DialogTrigger>
             <DialogContent className="w-[414px] h-[189px] !py-6 !px-6 !rounded-[24px]">
             <DialogHeader>
             <DialogTitle className="flex justify-center">{t('delete_button')}</DialogTitle>
             <DialogDescription className="flex justify-center !pt-[14px] text-[16px] text-[#333333]">
               {t('new_strings:are_you_sure_you_want_to_delete_the_contact')}
             </DialogDescription>
             </DialogHeader>
             <DialogFooter className="w-full flex !justify-center gap-6">
             <DialogClose>
             <Button className="border border-[#7677F4] bg-[white] w-[71px] h-[46px] text-[#7677F4] font-semibold">
                {t('no_button')}
             </Button>
             </DialogClose>
             <DialogClose>
             <Button
              className="bg-[#7677F4] w-[71px] h-[46px] rounded-[12px] font-semibold"
              onClick={() => {
                handleDeleteItem(index)
              }}
             >
             {t('yes')}
             </Button>
             </DialogClose>
             </DialogFooter>
             </DialogContent>
           </Dialog>
          )}
          </div>
        </div>
      ))}

      {/* Additional section for BCC registration confirmation email */}
      <div className="w-80 h-24 flex gap-1 flex-col ">
        <div className="flex flex-row text-xs font-normal text-[#333333]">
        {t("course.new_course:contact_info_tab.send_bcc")}{" "}
        </div>
        <Textarea
          value={courseEmails}
          onChange={(val) => {
            courseEmailOnChange(val?.target?.value);
          }}
          placeholder={t("course.new_course:contact_info_tab.select_course")}
          className="!w-58 placeholder:text-[#999999] font-normal"
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
    <div >
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
        className="w-60"
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

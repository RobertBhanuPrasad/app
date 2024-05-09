import DropDown from "@public/assets/DropDown";
import { NextRouter, useRouter } from "next/router";
import { Button } from "src/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { handleCourseDefaultValues } from "../newCourse/EditCourseUtil";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { useTranslation } from 'next-i18next';


export const ViewCourseGlobalActions = () => {
  const router = useRouter();
  const {t} = useTranslation(["common","course.find_course","course.participants","new_strings"])
  
  const globalActionsOptions = [
    t("view_participants"),
    // t("register_participant"),
    // "Register with online credit card payment",
    // "View Pending/Failed Tranactions",
    t("edit_course"),
    t("copy_course"),
    // t("cancel_course"),
    // "New Discount Code",
    // t('course.find_course:submit_course_accounting_form'),
    // t('new_strings:upload_attendance_record'),
    // t('course.participants:edit_participant.participants_information_tab.download_receipt'),
    // "Manage Google Adwords",
  ];

  const handleGlobalAction = (option: number) => {
    const ID: number | undefined = router?.query?.id
      ? parseInt(router.query.id as string)
      : undefined;

    switch (option) {
      // TODO: Naviagate to register participant page
      case 1:
        break;
      // TODO: Handle edit course
      case 2:
        break;
      // TODO: Handle copy course
      case 3:
        break;
      // TODO: Handle Cancel course
      case 4:
        break;
      // TODO: Handle Submit Course Accounting Form
      case 5:
        break;
      // TODO: Handle Upload Attendance Record
      case 6:
        break;
      // TODO: Handle Download Receipt
      case 7:
        break;
    }
  };
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row justify-between w-[192px] h-10"
        >
          {t('actions')}
          <DropDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[190px]">
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto scrollbar text-[#333333]">
          {globalActionsOptions.map((option: string, index: number) => (
            <DropdownMenuItem
              onClick={() => {
                handleGlobalAction(index);
              }}
              className=" cursor-pointer"
            >
              {option}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

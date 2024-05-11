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
import { useTranslation } from "next-i18next";
import _ from "lodash";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { TIME_FORMAT } from "src/constants/OptionLabels";
import { TIME_FORMAT_12_HOURS } from "src/constants/OptionValueOrder";

export const ViewCourseGlobalActions = () => {
  const router = useRouter();
  const { t } = useTranslation([
    "common",
    "course.find_course",
    "course.participants",
    "new_strings",
  ]);

  const ID: any = router?.query?.id
    ? parseInt(router.query.id as string)
    : undefined;

  const globalActionsOptions = [
    { label: t("view_participants"), value: 1 },
    // t("register_participant"),
    // "Register with online credit card payment",
    // "View Pending/Failed Tranactions",
    { label: t("edit_course"), value: 2 },
    { label: t("copy_course"), value: 3 },
    // t("cancel_course"),
    // "New Discount Code",
    // t('course.find_course:submit_course_accounting_form'),
    // t('new_strings:upload_attendance_record'),
    // t('course.participants:edit_participant.participants_information_tab.download_receipt'),
    // "Manage Google Adwords",
  ];

  const {
    setViewPreviewPage,
    setNewCourseData,
    setViewThankyouPage,
    setCurrentStep,
  } = newCourseStore();

  /**
   * when we click on edit course we change the route with particular course id
   */
  const handleEditCourse = async () => {
    router.push(`/courses/${ID}/edit`);
  };

  const timeFormat12HoursId = getOptionValueObjectByOptionOrder(
    TIME_FORMAT,
    TIME_FORMAT_12_HOURS
  )?.id as number;

  /**
   * Handles creating a new course.
   * Retrieves default values for the course with the given ID,
   * sets the retrieved values as the new course data, and
   * switches the view to the new course page.
   */
  const handleCopyCourse = async () => {
    setViewThankyouPage(false);

    let defaultValues = await handleCourseDefaultValues(
      ID,
      timeFormat12HoursId
    );
    // we have to delete schedules when user click on cipy course and other we need to prefill
    defaultValues = _.omit(defaultValues, ["id", "schedules"]);
    setNewCourseData(defaultValues);
    // when we do copy course we have to set the current step to first step
    setCurrentStep(1);
    router.push({ pathname: "/courses/add", query: { action: "Copy" } });
  };

  const handleGlobalAction = (option: number) => {
    switch (option) {
      // TODO: Naviagate to register participant page
      case 1:
        router.push(`/courses/${ID}/participants/list`);
        break;
      // TODO: Handle edit course
      case 2:
        handleEditCourse();
        break;
      // TODO: Handle copy course
      case 3:
        handleCopyCourse();
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
          {t("actions")}
          <DropDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[190px]">
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto scrollbar text-[#333333]">
          {globalActionsOptions.map((data: any) => (
            <DropdownMenuItem
              onClick={() => {
                handleGlobalAction(data?.value);
              }}
              className=" cursor-pointer"
            >
              {data?.label}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

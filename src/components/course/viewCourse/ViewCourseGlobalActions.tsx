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

export const ViewCourseGlobalActions = () => {
  const router = useRouter();

  const globalActionsOptions = [
    "View Participants",
    "Register Participant",
    // "Register with online credit card payment",
    // "View Pending/Failed Tranactions",
    "Edit Course",
    "Copy Course",
    "Cancel Course",
    // "New Discount Code",
    "Submit Course Accounting Form",
    "Upload Attendance Record",
    "Download Receipt",
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
          Actions
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

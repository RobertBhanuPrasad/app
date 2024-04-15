import Exclamation from "@public/assets/Exclamation";
import _ from "lodash";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "src/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "src/ui/dialog";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import { handleSaveCourseAccountingFormData } from "./CourseAccountingFormUtil";
import LoadingIcon from "@public/assets/LoadingIcon";

function ExpenseSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isSaving, setIsSaving] = useState(false); // state variable for save button

  const [cancelOpenDialog, setCancelOpenDialog] = useState(false);

  const params = useParams();

  const { getValues } = useFormContext();

  const { courseAccountingFormDefaultValues } = newCourseStore();

  function setParamValue(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("current_section", term);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  function handleCancelClick() {
    //if the formData from getValues and course accounting form values are same we will navigate to course accounting form tab
    // it means no changes are made so we can back no problem
    //if user changed anything we will open dialog box
    const formData = getValues();

    if (_.isEqual(formData, courseAccountingFormDefaultValues)) {
      replace(`/Courses/ViewCourse/${params?.id}`);
    } else {
      // if anything is changed we will open the dialog
      setCancelOpenDialog(true);
    }
  }

  /**
   * This function is used to navigate to course accounting form tab when user click on Yes button
   */
  const handleCancelDialogYesClick = () => {
    setCancelOpenDialog(false);
    replace(`/Courses/ViewCourse/${params?.id}`);
  };

  /**
   * This function is called when user clicks on Save button
   * It sets the state variable isSaving to true and after await it sets isSaving to false
   */
  const handleSaveClick = async () => {
    // set isSaving to true when user clicks on Save button
    setIsSaving(true);

    await handleSaveCourseAccountingFormData(
      getValues() as CourseAccountingFormFieldTypes
    );

    setIsSaving(false); // set isSaving to false after await
  };

  // Function to render Save button

  const handleCancelDialogNoClick = () => {
    setCancelOpenDialog(false);
  };

  return (
    <div>
      <div>
        expense
        <section className="space-x-4 p-2 w-full flex justify-center">
          <Button
            className="w-[118px] h-[46px] border border-[#7677F4] rounded-[12px] bg-[white] text-[#7677F4]"
            onClick={() => {
              setParamValue("revenue");
            }}
          >
            Previous
          </Button>

          <Button
            className={`w-[86px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white] `}
            onClick={handleSaveClick}
          >
            {isSaving ? <LoadingIcon /> : "Save"}
          </Button>

          <Button
            className="w-[101px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
            onClick={handleCancelClick}
            type="button"
          >
            Cancel
          </Button>
        </section>
        {/* It will open when user click on cancel button and if user changed any details */}
        <Dialog open={cancelOpenDialog}>
          <DialogContent className="flex flex-col  w-[425px] !rounded-[15px] !p-6">
            <DialogHeader>
              <div className="flex items-center w-full justify-center">
                <Exclamation />
              </div>
              <DialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
                Are you sure you want to cancel?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="w-full flex justify-center items-center gap-3">
                <Button onClick={handleCancelDialogNoClick}>No</Button>
                <Button onClick={handleCancelDialogYesClick}>YES</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ExpenseSection;

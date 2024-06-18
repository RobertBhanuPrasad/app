import Exclamation from "@public/assets/Exclamation";
import _ from "lodash";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useRouter as useNextRouter } from "next/router";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "src/ui/button";
import { ExpenseDetails } from "./ExpenseDetailsTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "src/ui/dialog";
import { newCourseStore } from "src/zustandStore/NewCourseStore";
import {
  handleSaveCourseAccountingFormData,
  handleSubmitCAF,
} from "./CourseAccountingFormUtil";
import LoadingIcon from "@public/assets/LoadingIcon";
import {
  GetOneResponse,
  HttpError,
  UseLoadingOvertimeReturnType,
  useGetIdentity,
  useList,
  useOne,
} from "@refinedev/core";
import { isCAFSubmitButtonVisible } from "@components/courseBusinessLogic";

import { QueryObserverResult } from "@tanstack/react-query";
import { getOptionValueObjectByOptionOrder } from "src/utility/GetOptionValuesByOptionLabel";
import { COURSE_ACCOUNTING_STATUS } from "src/constants/OptionLabels";
import { ACCOUNTING_PENDING_REVIEW } from "src/constants/OptionValueOrder";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CardValue, TableHeader, Text } from "src/ui/TextTags";

function ExpenseSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isSaving, setIsSaving] = useState(false); // state variable for save button
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const [cancelOpenDialog, setCancelOpenDialog] = useState(false);

  const params = useParams();

  const { getValues } = useFormContext();

  const { courseAccountingFormDefaultValues } = newCourseStore();

  const { query } = useNextRouter();

  const { data }: any = useGetIdentity();

  const {
    data: programData,
  }: QueryObserverResult<GetOneResponse<ProgramDataBaseType>, HttpError> &
    UseLoadingOvertimeReturnType = useOne({
    resource: "program",
    id: query?.id as string,
  });

  const { data: settingdData } = useList({
    resource: "course_accounting_config",
    config: {
      filters: [
        {
          field: "organization_id",
          operator: "eq",
          value: programData?.data?.organization_id,
        },
      ],
    },
  });

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
      replace(`/courses/${params?.id}`);
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
    replace(`/courses/${params?.id}`);
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

  const handleSubmitClick = async () => {
    //TODO: We need to do one more system setting configuration is expense exceeds limit we need to display validation messag

    setSubmitDialogOpen(true);
  };

  // Function to render Save button

  const handleCancelDialogNoClick = () => {
    setCancelOpenDialog(false);
  };

  const handleSubmitDialogNoClick = () => {
    setSubmitDialogOpen(false);
  };

  const courseAccountingPendingReviewtatusId =
    getOptionValueObjectByOptionOrder(
      COURSE_ACCOUNTING_STATUS,
      ACCOUNTING_PENDING_REVIEW
    )?.id as number;

  const handleSubmitDialogYesClick = async () => {
    // it is an async call so we need to set isSubmitting to true
    setIsSubmitting(true);

    // console.log("clicking on submit", data);
    // return;
    // when user click on submit we need to store revenues, expenses and course accounting user consent
    // 1.so for that we are calling this below function because the same code we have to excute what ever we are doing in this function
    // but additional to that
    // 2.we neeed to patch program with course accounting status id as pending review
    // 3.we need to patch program accounting activity with course accounting status id as pending review
    try {
      await handleSaveCourseAccountingFormData(
        getValues() as CourseAccountingFormFieldTypes
      );

      await handleSubmitCAF(
        getValues() as CourseAccountingFormFieldTypes,
        courseAccountingPendingReviewtatusId,
        data?.userData?.id
      );

      setSubmitDialogOpen(false);

      // if all api calls are done then we need to do two steps
      // 1. display one toast message
      // 2. navigate to view course accounting form tab
      toast("CAF submitted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setTimeout(() => {
        replace(`/courses/${params?.id}`);
      }, 3000);
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  };

  const fields = [
    {
      name: "bhargavi",
      timestamp: "245793890",
      action: "Submitted",
    },
    {
      name: "Madhuri",
      timestamp: "245793890",
      action: "Approved",
    },
  ];

  return (
    <div className="px-8">
      <div className="flex flex-col gap-8">
        <ExpenseDetails />

        {/*Expense summary details */}
        <div className="">
          <Text className="text-[18px] font-semibold">
            Expense Summary and Details
          </Text>
          <div className="border rounded-lg px-4 py-6 mt-2">
            <TableHeader className="text-[18px] font-semibold">
              Expense Summary{" "}
            </TableHeader>
            <div className="flex border-b py-2 mt-4">
              <Text className="flex-[0.4]">Expense category</Text>
              <Text className="text-[#898989] flex-[0.4]">Amount (EUR)</Text>
            </div>
            {[1, 2].map(() => {
              return (
                <div className="flex border-b py-2">
                  <Text className="flex-[0.4]">key</Text>
                  <Text className="text-[#898989] flex-[0.4]">value</Text>
                </div>
              );
            })}
            <div className="flex border-b py-2">
              <TableHeader className="flex-[0.4]">Total</TableHeader>
              <CardValue className="flex-[0.4]">123</CardValue>
            </div>
            <div className="flex py-2">
              <Text className="flex-[0.4]">Current Expense:</Text>
              <Text className="text-[#898989] flex-[0.4]">60.00 (10.00%)</Text>
            </div>
            <div className="flex  py-2">
              <Text className="flex-[0.4]">Allowed Expense Limit</Text>
              <Text className="text-[#898989] flex-[0.4]">180.00 (30.00%)</Text>
            </div>
          </div>
        </div>

        {/* Log table */}
        <div className="rounded-[12px] border border-[#D6D7D8] overflow-x-auto">
          <div className="flex h-[48px] min-w-fit bg-[#7677F41A]">
            <TableHeader className="px-[12px] min-w-[435px] w-full">
              Username
            </TableHeader>
            <TableHeader className="px-[12px] min-w-[524px] w-full">
              Timestamp
            </TableHeader>
            <TableHeader className="px-[12px] min-w-[288px] w-full">
              Action
            </TableHeader>
          </div>

          <div className="space-y-[12px] my-[12px]">
            {fields?.map((field: any) => (
              <div className="flex items-center w-full h-auto">
                <div className="px-[12px] min-w-[435px] w-full">
                  {field?.name}
                </div>
                <div className="px-[12px] min-w-[524px] w-full">
                  {field?.timestamp}
                </div>
                <div className="px-[12px] min-w-[288px] w-full">
                  {field?.action}
                </div>
              </div>
            ))}
          </div>
        </div>
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
            className="w-[101px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white]"
            onClick={handleCancelClick}
            type="button"
          >
            Cancel
          </Button>

          <Button
            className={`w-[86px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white] `}
            onClick={handleSaveClick}
          >
            {isSaving ? <LoadingIcon /> : "Save"}
          </Button>

          {/* display submit button only when course status is completed */}
          {isCAFSubmitButtonVisible(programData?.data?.status_id as number) && (
            <>
              <Button
                className={`w-[106px] h-[46px]  bg-[#7677F4] rounded-[12px] text-[white] `}
                onClick={handleSubmitClick}
              >
                {isSubmitting ? <LoadingIcon /> : "Submit"}
              </Button>

              {/* We have to display warning message when user click yes proceed to save details 
                when user click no we will just close the dialog
              */}
              <Dialog open={submitDialogOpen}>
                <DialogContent className="flex flex-col  w-[425px] !rounded-[15px] !p-6">
                  <DialogHeader>
                    <div className="flex items-center w-full justify-center">
                      <Exclamation />
                    </div>
                    <DialogDescription className="font-semibold text-[20px] text-[#333333] items-center text-center">
                      Are you sure you want to submit the CAF?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="w-full flex justify-center items-center gap-3">
                      <Button onClick={handleSubmitDialogNoClick}>No</Button>
                      <Button onClick={handleSubmitDialogYesClick}>YES</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* This code is for to display toast message as CAF submitted successfully */}

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
              />
            </>
          )}
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

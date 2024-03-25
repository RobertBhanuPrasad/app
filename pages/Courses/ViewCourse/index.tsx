import React, { useState } from "react";
import {
  COURSE_ACCOUNTING_FORM_TAB,
  COURSE_DETAILS_TAB,
  PARTICIPANTS_TAB,
  REVENUE_SUMMARY_TAB,
} from "src/constants/Tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/ui/tabs";

function index() {
  const [selectedValue, setSelectedValue] = useState();
  const tabTriggers: any = [
    { value: COURSE_DETAILS_TAB, label: "Course Details", disabled: false },
    { value: PARTICIPANTS_TAB, label: "Participants", disabled: false },
    { value: REVENUE_SUMMARY_TAB, label: "Revenue Summary", disabled: false },
    {
      value: COURSE_ACCOUNTING_FORM_TAB,
      label: "Course Accounting Form",
      disabled: true,
    },
  ];
  
  return (
    <div className="w-full ">
      <Tabs
        onValueChange={(val: any) => {
          setSelectedValue(val);
        }}
      >
        <TabsList className="flex flex-row gap-10 !flex-start !justify-start !bg-[white] !rounded-none">
          {tabTriggers.map((trigger: any, index: any) => (
            <TabsTrigger
              key={index}
              value={trigger.value}
              className={`!px-0 data-[state=active]:text-[#7677F4] py-1.5 text-sm font-medium flex flex-start !data-[state=active]:text-[#7677F4]  !data-[disabled]:text-[#999999]  `}
              disabled={trigger.disabled}
            > 
              <div className="flex flex-col gap-1">
                {trigger.label}
                <div
                  className={`${
                    selectedValue === trigger.value
                      ? "bg-[#7677F4] rounded w-full h-[2px]"
                      : "w-full h-[2px]"
                  }`}
                />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="w-full border-b -mt-2"></div>
        <TabsContent value="Course Details">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="Participants">
          Change your password here.
        </TabsContent>
        <TabsContent value="Revenue Summary">Change your password</TabsContent>
        <TabsContent value="Course Accounting Form">Change your</TabsContent>
      </Tabs>
    </div>
  );
}

export default index;
